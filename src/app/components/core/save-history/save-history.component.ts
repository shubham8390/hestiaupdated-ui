import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../Services/api.service';

export interface SavedConversation {
  id: string;
  title: string;
  messages: any[];
  timestamp: Date;
  lastUpdated: Date;
}

@Component({
  selector: 'app-save-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './save-history.component.html',
  styleUrl: './save-history.component.css'
})
export class SaveHistoryComponent implements OnInit, OnChanges {
  @Input() currentMessages: any[] = [];
  @Input() currentSessionId: string | null = null;
  @Output() loadConversation = new EventEmitter<any[]>();
  @Output() clearCurrentChat = new EventEmitter<void>();
  @Output() collapseSidebar = new EventEmitter<void>();

  savedConversations: any[] = [];
  searchQuery: string = '';
  isDeleteMode: boolean = false;
  hoveredConversation: string | null = null;
  private lastMessageCount: number = 0;

  ngOnInit() {
    this.loadSavedConversations();
    this.lastMessageCount = this.currentMessages.length;
  }

  ngOnChanges(changes: SimpleChanges) {
    // Detect when current session changes
    if (changes['currentSessionId'] && this.currentSessionId) {
      this.refreshHistoryList();
    }
    
    // Detect when messages are added (new conversation activity)
    if (changes['currentMessages'] && this.currentMessages.length > this.lastMessageCount) {
      this.lastMessageCount = this.currentMessages.length;
      // Refresh history to show updated conversation
      setTimeout(() => {
        this.refreshHistoryList();
      }, 1000); // Small delay to ensure API is updated
    }
  }

  constructor(private apiservice: ApiService) {}

  get filteredConversations() {
    if (!this.searchQuery.trim()) {
      return this.savedConversations;
    }
    
    return this.savedConversations.filter(conv => 
      conv.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      conv.messages?.some((msg: any) => 
        msg.content.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    );
  }

  saveCurrentConversation() {
    if (this.currentMessages.length === 0) {
      return;
    }

     const title = this.generateConversationTitle(this.currentMessages);
    const newConversation: SavedConversation = {
      id: this.generateId(),
      title,
      messages: [...this.currentMessages],
      timestamp: new Date(),
      lastUpdated: new Date()
    };

    this.savedConversations.unshift(newConversation);

    // Since the conversation is already saved via API when messages are sent,
    // we just need to refresh the history list
    this.refreshHistoryList();
  }

  refreshHistoryList() {
    this.apiservice.getAllChatHistory().subscribe(
      (res: any) => {
        this.savedConversations = res;
      },
      error => {
        console.error('Error refreshing history:', error);
      }
    );
  }
  loadConversationById(id: string) {
    let conversation:any;
    this.apiservice.getHistoryofChat(id).subscribe(res=>{
        conversation=res;
         if (conversation) {
            localStorage.setItem('sessionId',id)
      debugger
      this.loadConversation.emit(conversation.history);
    }
    },error=>{

    })
    
   
  }
  deleteConversation(id: string, event: Event) {
    event.stopPropagation();
    
    // TODO: Implement API call to delete conversation
    // For now, just remove from local array and refresh
    this.savedConversations = this.savedConversations.filter(conv => conv._id !== id);
    
    // If you have a delete API endpoint, uncomment and implement this:
    // this.apiservice.deleteConversation(id).subscribe(
    //   () => {
    //     this.refreshHistoryList();
    //   },
    //   error => {
    //     console.error('Error deleting conversation:', error);
    //     // Reload to revert changes on error
    //     this.refreshHistoryList();
    //   }
    // );
  }

  clearAllHistory() {
    if (confirm('Are you sure you want to clear all saved conversations? This action cannot be undone.')) {
      this.savedConversations = [];
      // TODO: Implement API call to clear all history
      // this.apiservice.clearAllHistory().subscribe(() => {
      //   this.refreshHistoryList();
      // });
    }
  }

  startNewChat() {
    this.clearCurrentChat.emit();
    // Refresh history to show the latest state
    setTimeout(() => {
      this.refreshHistoryList();
    }, 500);
  }

  toggleDeleteMode() {
    this.isDeleteMode = !this.isDeleteMode;
  }

  collapseSidebarPanel() {
    this.collapseSidebar.emit();
  }

  private generateConversationTitle(messages: any[]): string {
    const firstUserMessage = messages.find(msg => msg.type === 'user' || msg.role === 'user');
    if (firstUserMessage) {
      let title = firstUserMessage.content.substring(0, 50);
      if (firstUserMessage.content.length > 50) {
        title += '...';
      }
      return title;
    }
    return 'New Conversation';
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private loadSavedConversations() {
    this.apiservice.getAllChatHistory().subscribe(
      (res: any) => {
        this.savedConversations = res;
      },
      error => {
        console.error('Error loading saved conversations:', error);
      }
    );
  }

  private saveSavedConversations() {
    localStorage.setItem('hestia_saved_conversations', JSON.stringify(this.savedConversations));
  }

  formatDate(dates: any): string {
    const dateStr = dates;
    // Trim to milliseconds precision (first 3 digits of microseconds)
    const trimmedStr = dateStr.slice(0, 23); // "2025-07-13T23:15:55.841"
    const date = new Date(trimmedStr);

    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  trackByConversationId(index: number, conversation: any): string {
    return conversation._id || conversation.id;
  }
}
