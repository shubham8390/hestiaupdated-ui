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
  files?: File[];
}

interface Tool {
  id: string;
  name: string;
  description: string;
  icon?: string;
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
  uploadedFiles: File[] = [];
  
  // Tools functionality
  selectedTool: Tool | null = null;
  isToolsPopupOpen: boolean = false;
  
  // Sidebar states
  isNavigationSidebarExpanded: boolean = true;
  isHistorySidebarOpen: boolean = false;
  isPropertiesSidebarOpen: boolean = false;
  isMobileView: boolean = false;

  // Available tools
  private tools: Tool[] = [
    {
      id: 'property-search',
      name: 'Property Search',
      description: 'Search and analyze properties with AI'
    }
  ];

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
    const target = event.target as HTMLElement;
    const toolsButton = target.closest('.tools-button-container');
    const toolsPopup = target.closest('.tools-popup');
    
    // Close popup if clicking outside both the button and popup
    if (this.isToolsPopupOpen && !toolsButton && !toolsPopup) {
      this.isToolsPopupOpen = false;
    }
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

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Add selected files to uploadedFiles array
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Check file size (max 10MB per file)
        if (file.size <= 10 * 1024 * 1024) {
          this.uploadedFiles.push(file);
        } else {
          console.warn(`File ${file.name} is too large. Maximum size is 10MB.`);
        }
      }
    }
    // Clear the input value so the same file can be selected again if needed
    event.target.value = '';
  }

  removeFile(index: number) {
    this.uploadedFiles.splice(index, 1);
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

  toggleToolsPopup() {
    this.isToolsPopupOpen = !this.isToolsPopupOpen;
  }



  selectTool(toolId: string) {
    const tool = this.tools.find(t => t.id === toolId);
    if (tool) {
      this.selectedTool = tool;
      this.isToolsPopupOpen = false;
    }
  }

  clearSelectedTool() {
    this.selectedTool = null;
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

  sendMessage() {
    if ((!this.currentMessage.trim() && this.uploadedFiles.length === 0) || this.isLoading) return;

    const userMessage: ChatMessage = {
      type: 'user',
      content: this.currentMessage.trim() || 'Uploaded files',
      timestamp: new Date(),
      files: this.uploadedFiles.length > 0 ? [...this.uploadedFiles] : undefined
    };

    this.messages.push(userMessage);
    const messageContent = this.currentMessage.trim();
    const messageFiles = [...this.uploadedFiles];
    const currentTool = this.selectedTool;
    
    // Clear current input and files
    this.currentMessage = '';
    this.uploadedFiles = [];
    this.adjustTextareaHeight();
    this.isLoading = true;

    // Prepare request object with tool context if selected
    let queryPrefix = '';
    if (currentTool && currentTool.id === 'property-search') {
      queryPrefix = '[PROPERTY_SEARCH] ';
    }

    const requestObj = {
      session_id: this.sessionId || "",
      query: queryPrefix + (messageContent || "I've uploaded some files for you to analyze.")
    };

    // Note: File upload to API would need to be implemented based on your API requirements
    // For now, we'll send the text message only
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
    this.uploadedFiles = [];
    this.selectedTool = null;
    this.isToolsPopupOpen = false;
    this.adjustTextareaHeight();
  }
}
