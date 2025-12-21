import { Component, ViewChild, ElementRef, AfterViewChecked, OnInit, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationSidebarComponent } from '../../shared/navigation-sidebar/navigation-sidebar.component';
import { SaveHistoryComponent } from '../save-history/save-history.component';
import { PropertyListingComponent } from '../property-listing/property-listing.component';
import { PropertyDetailsComponent } from '../../shared/property-details/property-details.component';
import { ApiService } from '../Services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

interface ChatMessage {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  liked?: boolean;
  disliked?: boolean;
  files?: File[];
  messageId?: string;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

interface Suggestion {
  id: string;
  text: string;
  category?: string;
  icon?: string;
}

@Component({
  selector: 'app-chat-ui',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    NavigationSidebarComponent, 
    SaveHistoryComponent, 
    PropertyListingComponent, 
    PropertyDetailsComponent
  ],
  templateUrl: './chat-ui.component.html',
  styleUrl: './chat-ui.component.css'
})
export class ChatUIComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  // Chat State
  messages: ChatMessage[] = [];
  currentMessage: string = '';
  isLoading: boolean = false;
  sessionId: string | null = null;
  uploadedFiles: File[] = [];
  isSessionCreated: boolean = false;

  // Tools & Features
  selectedTool: Tool | null = null;
  isToolsPopupOpen: boolean = false;
  isCalender: boolean = false;
  propertyserach: boolean = false;
  propertyResearch: boolean = false;

  // Sidebar States
  isNavigationSidebarExpanded: boolean = true;
  isHistorySidebarOpen: boolean = false;
  isPropertiesSidebarOpen: boolean = false;
  showPropertyDetails: boolean = false;
  isMobileView: boolean = false;

  // Popups & Modals
  showPropertyResearchPopup: boolean = false;
  showSuggestions: boolean = true;

  // Project & Auth
  projecteditId: string = '';
  private routeSubscription!: Subscription;

  // Available tools
  private tools: Tool[] = [
    {
      id: 'property-search',
      name: 'Property Search',
      description: 'Search and analyze properties with AI',
      icon: 'property'
    },
    {
      id: 'deep-search',
      name: 'Deep Search',
      description: 'Advanced property analysis with AI',
      icon: 'search'
    },
    {
      id: 'calender',
      name: 'Calendar',
      description: 'Search and analyze schedule',
      icon: 'calendar'
    }
  ];

  // Enhanced suggestions with categories
  suggestions: Suggestion[] = [
    {
      id: 's1',
      text: "What factors affect property valuation?",
      category: "Property Analysis",
      icon: "📊"
    },
    {
      id: 's2',
      text: "How do I find the best investment properties?",
      category: "Investment",
      icon: "💰"
    },
    {
      id: 's3',
      text: "What are the current real estate market trends?",
      category: "Market Research",
      icon: "📈"
    },
    {
      id: 's4',
      text: "Guide me through the home buying process",
      category: "Home Buying",
      icon: "🏠"
    },
    {
      id: 's5',
      text: "Compare properties in different neighborhoods",
      category: "Comparison",
      icon: "⚖️"
    },
    {
      id: 's6',
      text: "What documents do I need for a mortgage?",
      category: "Documentation",
      icon: "📄"
    }
  ];

  // Filtered suggestions based on context
  filteredSuggestions: Suggestion[] = [];

  // Auto-scroll configuration
  private autoScrollEnabled: boolean = true;
  private scrollDebounceTimeout: any;

  constructor(
    private apiService: ApiService, 
    private route: ActivatedRoute,
    private router: Router
  ) {}
user_id :any;
  ngOnInit() {
    this.user_id = localStorage.getItem("user_id");
    this.initializeChat();
    this.setupRouteSubscriptions();
    this.setupResizeListener();
    this.filterSuggestions();
  }

  ngAfterViewChecked() {
    if (this.autoScrollEnabled) {
      this.scrollToBottom();
    }
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.scrollDebounceTimeout) {
      clearTimeout(this.scrollDebounceTimeout);
    }
  }

  private initializeChat(): void {
    this.adjustTextareaHeight();
    this.checkMobileView();
    this.loadSidebarState();
    this.loadExistingSession();
  }

  private setupRouteSubscriptions(): void {
    this.routeSubscription = this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const projectId = params['projectId'];
      
      if (code) {
        localStorage.setItem('token', code);
      }
      
      if (projectId) {
        this.projecteditId = projectId;
      }
    });
  }

  private setupResizeListener(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.onResize.bind(this));
    }
  }

  private loadSidebarState(): void {
    if (!this.isMobileView) {
      this.isNavigationSidebarExpanded = false;
    } else {
      const savedNavState = localStorage.getItem('navigationSidebarExpanded');
      this.isNavigationSidebarExpanded = savedNavState ? JSON.parse(savedNavState) : false;
    }
  }

  private loadExistingSession(): void {
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      this.sessionId = sessionId;
      this.getHistoryofChat();
    }
  }

  private filterSuggestions(): void {
    // Filter suggestions based on current context (selected tool, conversation history, etc.)
    if (this.selectedTool) {
      this.filteredSuggestions = this.suggestions.filter(suggestion => 
        suggestion.category?.toLowerCase().includes(this.selectedTool?.name.toLowerCase() || '')
      );
    } else {
      this.filteredSuggestions = [...this.suggestions];
    }
    
    // Limit to 4 suggestions when displayed
    this.filteredSuggestions = this.filteredSuggestions.slice(0, 4);
  }

  // Enhanced Event Handlers
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const toolsButton = target.closest('.tools-button-container');
    const toolsPopup = target.closest('.tools-popup');
    
    if (this.isToolsPopupOpen && !toolsButton && !toolsPopup) {
      this.isToolsPopupOpen = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkMobileView();
    this.adjustTextareaHeight();
  }

  private checkMobileView(): void {
    if (typeof window !== 'undefined') {
      this.isMobileView = window.innerWidth < 1024;
    }
  }

  // Navigation & Sidebar Methods
  toggleNavigationSidebar(): void {
    this.isNavigationSidebarExpanded = !this.isNavigationSidebarExpanded;
    localStorage.setItem('navigationSidebarExpanded', JSON.stringify(this.isNavigationSidebarExpanded));
  }

  toggleHistorySidebar(): void {
    this.isHistorySidebarOpen = !this.isHistorySidebarOpen;
  }

  togglePropertiesSidebar(): void {
    this.isPropertiesSidebarOpen = !this.isPropertiesSidebarOpen;
  }

  // File Handling Methods
  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (this.validateFile(file)) {
          this.uploadedFiles.push(file);
        }
      }
    }
    event.target.value = '';
  }

  private validateFile(file: File): boolean {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/', 'application/pdf', 'application/msword', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

    if (file.size > maxSize) {
      console.warn(`File ${file.name} is too large. Maximum size is 10MB.`);
      return false;
    }

    if (!allowedTypes.some(type => file.type.startsWith(type.replace('application/', '')))) {
      console.warn(`File type ${file.type} is not supported.`);
      return false;
    }

    return true;
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }

  // Input & Message Handling
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    } else if (event.key === 'Enter' && event.shiftKey) {
      setTimeout(() => this.adjustTextareaHeight(), 0);
    }
  }

  onInputChange(): void {
    this.adjustTextareaHeight();
    this.filterSuggestions();
  }

  private adjustTextareaHeight(): void {
    setTimeout(() => {
      if (this.messageInput) {
        const textarea = this.messageInput.nativeElement;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
      }
    }, 0);
  }

  // Tool Selection Methods
  toggleToolsPopup(): void {
    this.isToolsPopupOpen = !this.isToolsPopupOpen;
    if (this.isToolsPopupOpen) {
      this.filterSuggestions();
    }
  }

  selectTool(toolId: string): void {
    const tool = this.tools.find(t => t.id === toolId);
    if (tool) {
      this.selectedTool = tool;
      this.isToolsPopupOpen = false;
      
      // Set feature flags based on tool selection
      this.propertyserach = toolId === 'property-search';
      this.isCalender = toolId === 'calender';
      
      this.filterSuggestions();
    }
  }

  clearSelectedTool(): void {
    this.selectedTool = null;
    this.propertyserach = false;
    this.isCalender = false;
    this.filterSuggestions();
  }

  // Suggestion Methods
  useSuggestion(suggestion: Suggestion): void {
    this.currentMessage = suggestion.text;
    this.adjustTextareaHeight();
    // Optionally auto-send or just populate the input
    // this.sendMessage(); // Uncomment to auto-send
  }

  // Message Interaction Methods
  onLikeMessage(index: number): void {
    this.messages[index].liked = !this.messages[index].liked;
    if (this.messages[index].liked) {
      this.messages[index].disliked = false;
    }
    // Here you could send feedback to your API
    this.sendFeedbackToAPI(this.messages[index], 'like');
  }

  onDislikeMessage(index: number): void {
    this.messages[index].disliked = !this.messages[index].disliked;
    if (this.messages[index].disliked) {
      this.messages[index].liked = false;
    }
    // Here you could send feedback to your API
    this.sendFeedbackToAPI(this.messages[index], 'dislike');
  }

  private sendFeedbackToAPI(message: ChatMessage, feedback: string): void {
    // Implement API call to send feedback
    console.log(`Sending ${feedback} for message:`, message);
  }

  onCopyMessage(content: string): void {
    navigator.clipboard.writeText(content).then(() => {
      // You could show a toast notification here
      console.log('Message copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy message:', err);
    });
  }

  onRegenerateResponse(index: number): void {
    if (index > 0 && this.messages[index - 1].type === 'user') {
      const userMessage = this.messages[index - 1].content;
      this.messages.splice(index, 1);
      this.currentMessage = userMessage;
      this.sendMessage();
    }
  }

  // Main Message Sending Method
  sendMessage(): void {
    if ((!this.currentMessage.trim() && this.uploadedFiles.length === 0) || this.isLoading) {
      return;
    }

    // Add user message to chat
    const userMessage: ChatMessage = {
      type: 'user',
      content: this.currentMessage,
      timestamp: new Date(),
      files: [...this.uploadedFiles],
      messageId: this.generateMessageId()
    };

    this.messages.push(userMessage);
    this.showSuggestions = false; // Hide suggestions after first message

    // Prepare for API call
    this.isLoading = true;
    const requestObj = this.prepareRequestObject();

    // Clear input and files
    this.clearInput();

    // Send to API
    this.apiService.getChatResponse(requestObj).subscribe({
      next: (response: any) => {
        this.handleApiResponse(response);
      },
      error: (error) => {
        this.handleApiError(error);
      }
    });
  }

  private prepareRequestObject(): any {
    const sessionId = localStorage.getItem('sessionId') || '';

    return {
      session_id: sessionId,
      query: this.currentMessage,
      properties: this.propertyserach,
      research: this.propertyResearch,
      calendar: this.isCalender,
      user_id: this.user_id, // This should probably come from auth service
      project_id: this.projecteditId || '',
      files: this.uploadedFiles.length > 0 ? this.uploadedFiles : undefined
    };
  }

  private handleApiResponse(response: any): void {
    this.isSessionCreated = true;
    this.sessionId = response.session_id;
    
    if (this.sessionId) {
      localStorage.setItem('sessionId', this.sessionId);
    }

    const assistantMessage: ChatMessage = {
      type: 'assistant',
      content: response.answer,
      timestamp: new Date(),
      messageId: this.generateMessageId()
    };

    this.messages.push(assistantMessage);
    this.isLoading = false;
  }

  private handleApiError(error: any): void {
    console.error('Error sending message:', error);
    
    const errorMessage: ChatMessage = {
      type: 'assistant',
      content: 'Sorry, I encountered an error while processing your request. Please try again.',
      timestamp: new Date(),
      messageId: this.generateMessageId()
    };

    this.messages.push(errorMessage);
    this.isLoading = false;
  }

  private generateMessageId(): string {
    return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private clearInput(): void {
    this.currentMessage = '';
    this.uploadedFiles = [];
    this.adjustTextareaHeight();
  }

  // History Management
  onLoadConversation(messages: any[]): void {
    this.messages = messages.map(msg => ({
      type: msg.role,
      content: msg.content,
      timestamp: new Date(msg.timestamp || Date.now()),
      messageId: this.generateMessageId()
    }));
    
    this.showSuggestions = this.messages.length === 0;
    
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  onClearCurrentChat(): void {
    this.clearChat();
  }

  clearChat(): void {
    this.messages = [];
    this.sessionId = null;
    this.propertyserach = false;
    this.currentMessage = '';
    this.uploadedFiles = [];
    this.selectedTool = null;
    this.isToolsPopupOpen = false;
    this.projecteditId = '';
    this.propertyResearch = false;
    this.showSuggestions = true;
    
    localStorage.removeItem('sessionId');
    this.router.navigate(['/chat']);
  }

  // Property Research Methods
  onPropertyResearchClick(): void {
    this.propertyserach = !this.propertyserach;
    this.propertyResearch = this.propertyserach;
    this.showPropertyResearchPopup = true;

    // Auto-close popup after 2 seconds
    setTimeout(() => {
      this.showPropertyResearchPopup = false;
    }, 2000);
  }

  closePropertyResearchPopup(): void {
    this.showPropertyResearchPopup = false;
    this.propertyserach = false;
    this.propertyResearch = false;
  }

  // Property Details Methods
  onExpandPropertiesSidebar(): void {
    this.showPropertyDetails = true;
  }

  onClosePropertyDetails(): void {
    this.showPropertyDetails = false;
  }

  // API Data Methods
  getHistoryofChat(): void {
    if (!this.sessionId) return;

    this.apiService.getHistoryofChat(this.sessionId).subscribe(
      (res: any) => {
        this.messages = res.history.map((element: any) => ({
          type: element.role,
          content: element.content,
          timestamp: new Date(),
          messageId: this.generateMessageId()
        }));
        this.showSuggestions = this.messages.length === 0;
      },
      error => {
        console.error('Error loading chat history:', error);
      }
    );
  }

  // Utility Methods
  formatMessageContent(content: string): string {
    return content
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-900 p-3 rounded-lg overflow-x-auto my-3"><code>$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-900 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/^(Step\s*\d+:?\s*)([^\n\r]+)/gm, '<div class="step-header"><span class="step-number">$1</span><span class="step-title">$2</span></div>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
      .replace(/^(\d+\.)\s+(.+)$/gm, '<div class="my-3"><span class="font-semibold text-purple-400 mr-2">$1</span>$2</div>')
      .replace(/^[\s]*[-*]\s(.+)$/gm, '<div class="my-2 ml-4">• $1</div>')
      .replace(/\n\s*\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>')
      .replace(/^(.*)$/, '<div class="formatted-content">$1</div>')
      .replace(/<\/p><p class="mb-4">/g, '</p><p class="mb-4">');
  }

  private scrollToBottom(): void {
    if (this.scrollDebounceTimeout) {
      clearTimeout(this.scrollDebounceTimeout);
    }

    this.scrollDebounceTimeout = setTimeout(() => {
      try {
        if (this.messagesContainer && this.autoScrollEnabled) {
          const element = this.messagesContainer.nativeElement;
          element.scrollTop = element.scrollHeight;
        }
      } catch (err) {
        console.error('Error scrolling to bottom:', err);
      }
    }, 100);
  }

  // Additional utility methods
  trackByMessageId(index: number, message: ChatMessage): string {
    return message.messageId || index.toString();
  }

  trackBySuggestionId(index: number, suggestion: Suggestion): string {
    return suggestion.id;
  }

  getRemainingSuggestions(): Suggestion[] {
    return this.filteredSuggestions.slice(0, 4);
  }

  isSendButtonDisabled(): boolean {
    return (!this.currentMessage.trim() && this.uploadedFiles.length === 0) || this.isLoading;
  }

  getSendButtonColor(): string {
    if (this.isSendButtonDisabled()) {
      return 'text-gray-400 hover:text-gray-200 hover:bg-gray-700';
    }
    return 'bg-purple-600 hover:bg-purple-700 text-white';
  }
}