import { Component, ViewChild, ElementRef, AfterViewChecked, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationSidebarComponent } from '../../shared/navigation-sidebar/navigation-sidebar.component';
import { SaveHistoryComponent } from '../save-history/save-history.component';
import { PropertyListingComponent } from '../property-listing/property-listing.component';
import { ApiService } from '../Services/api.service';

interface ChatMessage {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  liked?: boolean;
  disliked?: boolean;
}

@Component({
  selector: 'app-chat-ui',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationSidebarComponent, SaveHistoryComponent, PropertyListingComponent],
  templateUrl: './chat-ui.component.html',
  styleUrl: './chat-ui.component.css'
})
export class ChatUIComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  messages: ChatMessage[] = [];
  currentMessage: string = '';
  isLoading: boolean = false;
  sessionId: string | null = null;
  
  // Sidebar states
  isNavigationSidebarExpanded: boolean = true;
  isHistorySidebarOpen: boolean = false;
  isPropertiesSidebarOpen: boolean = false;
  isMobileView: boolean = false;

  suggestions: string[] = [
    "What factors affect property valuation?",
    "How do I find the best investment properties?", 
    "What are the current real estate market trends?",
    "Guide me through the home buying process"
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.adjustTextareaHeight();
    this.checkMobileView();
    // Start collapsed on desktop for hover-to-expand experience
    if (!this.isMobileView) {
      this.isNavigationSidebarExpanded = false;
    } else {
      // Load sidebar state from localStorage on mobile
      const savedNavState = localStorage.getItem('navigationSidebarExpanded');
      this.isNavigationSidebarExpanded = savedNavState ? JSON.parse(savedNavState) : false;
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  // Close dropdowns when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // This will be handled by child components
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkMobileView();
  }

  private checkMobileView() {
    if (typeof window !== 'undefined') {
      this.isMobileView = window.innerWidth < 1024; // lg breakpoint
    }
  }

  toggleNavigationSidebar() {
    this.isNavigationSidebarExpanded = !this.isNavigationSidebarExpanded;
    // Save state to localStorage
    localStorage.setItem('navigationSidebarExpanded', JSON.stringify(this.isNavigationSidebarExpanded));
  }

  toggleHistorySidebar() {
    this.isHistorySidebarOpen = !this.isHistorySidebarOpen;
  }

  togglePropertiesSidebar() {
    this.isPropertiesSidebarOpen = !this.isPropertiesSidebarOpen;
  }



  onSuggestionClick(suggestion: string) {
    this.currentMessage = suggestion;
    this.sendMessage();
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    } else if (event.key === 'Enter' && event.shiftKey) {
      // Allow line break with Shift+Enter
      setTimeout(() => this.adjustTextareaHeight(), 0);
    }
  }

  onInputChange() {
    this.adjustTextareaHeight();
  }

  sendMessage() {
    if (!this.currentMessage.trim() || this.isLoading) return;

    const userMessage: ChatMessage = {
      type: 'user',
      content: this.currentMessage.trim(),
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    const messageContent = this.currentMessage.trim();
    this.currentMessage = '';
    this.adjustTextareaHeight();
    this.isLoading = true;

    // Prepare request object based on whether session exists
    const requestObj = {
      session_id: this.sessionId || "",
      query: messageContent
    };

    this.apiService.getChatResponse(requestObj).subscribe({
      next: (response) => {
        if (response) {
          // If this is the first message, store the session ID
          if (!this.sessionId && response.session_id) {
            this.sessionId = response.session_id;
          }

          const assistantMessage: ChatMessage = {
            type: 'assistant',
            content: response.answer,
            timestamp: new Date()
          };
          
          this.messages.push(assistantMessage);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error sending message:', error);
        
        const errorMessage: ChatMessage = {
          type: 'assistant',
          content: 'Sorry, I encountered an error while processing your request. Please try again.',
          timestamp: new Date()
        };
        
        this.messages.push(errorMessage);
        this.isLoading = false;
      }
    });
  }

  clearChat() {
    this.messages = [];
    this.sessionId = null;
    this.currentMessage = '';
    this.adjustTextareaHeight();
  }

  onLikeMessage(index: number) {
    this.messages[index].liked = !this.messages[index].liked;
    if (this.messages[index].liked) {
      this.messages[index].disliked = false;
    }
  }

  onDislikeMessage(index: number) {
    this.messages[index].disliked = !this.messages[index].disliked;
    if (this.messages[index].disliked) {
      this.messages[index].liked = false;
    }
  }

  onCopyMessage(content: string) {
    navigator.clipboard.writeText(content).then(() => {
      console.log('Message copied to clipboard');
    });
  }

  onRegenerateResponse(index: number) {
    if (index > 0 && this.messages[index-1].type === 'user') {
      const userMessage = this.messages[index-1].content;
      // Remove the assistant message we want to regenerate
      this.messages.splice(index, 1);
      // Resend the user message
      this.currentMessage = userMessage;
      this.sendMessage();
    }
  }

  onLoadConversation(messages: ChatMessage[]) {
    this.messages = messages;
    setTimeout(() => this.scrollToBottom(), 100);
  }

  onClearCurrentChat() {
    this.clearChat();
  }

  formatMessageContent(content: string): string {
    // Enhanced formatting for better readability
    return content
      // Handle code blocks first
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-900 p-3 rounded-lg overflow-x-auto my-3"><code>$1</code></pre>')
      // Handle inline code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-900 px-1 py-0.5 rounded text-sm">$1</code>')
      // Handle step headers (Step 1:, Step 2:, etc.) - make them prominent
      .replace(/^(Step\s*\d+:?\s*)([^\n\r]+)/gm, '<div class="step-header"><span class="step-number">$1</span><span class="step-title">$2</span></div>')
      // Handle bold text
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
      // Handle numbered lists with better spacing and formatting
      .replace(/^(\d+\.)\s+(.+)$/gm, '<div class="my-3"><span class="font-semibold text-purple-400 mr-2">$1</span>$2</div>')
      // Handle bullet points
      .replace(/^[\s]*[-*]\s(.+)$/gm, '<div class="my-2 ml-4">• $1</div>')
      // Handle paragraph breaks (double line breaks)
      .replace(/\n\s*\n/g, '</p><p class="mb-4">')
      // Handle single line breaks
      .replace(/\n/g, '<br>')
      // Wrap entire content in formatted container
      .replace(/^(.*)$/, '<div class="formatted-content">$1</div>')
      // Clean up any issues with nested tags
      .replace(/<\/p><p class="mb-4">/g, '</p><p class="mb-4">');
  }

  private adjustTextareaHeight() {
    setTimeout(() => {
      if (this.messageInput) {
        const textarea = this.messageInput.nativeElement;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
      }
    }, 0);
  }

  private scrollToBottom() {
    try {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}
