import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyListingComponent } from '../property-listing/property-listing.component';
import { SaveHistoryComponent } from '../save-history/save-history.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { ApiService } from '../Services/api.service';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-chat-ui',
  standalone: true,
  imports: [CommonModule, FormsModule, PropertyListingComponent, SaveHistoryComponent, HeaderComponent,MarkdownModule],
  templateUrl: './chat-ui.component.html',
  styleUrl: './chat-ui.component.css'
})
export class ChatUIComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  messages: any[] = [];
  sessionId:any
  isLoading: boolean = false;
  isHistorySidebarOpen: boolean = false;
  isPropertiesSidebarOpen: boolean = false;
  isUploadPopupOpen: boolean = false;
  isSessionCreated:boolean=false;
  suggestions: string[] = [
    'What is artificial intelligence?',
    'How does machine learning work?',
    'Explain quantum computing',
    'What are the latest tech trends?'
  ];

constructor(private apiservice:ApiService) {
  
  
}

  ngOnInit() {
    // Open history sidebar by default on desktop, closed on mobile
    let id=sessionStorage?.getItem('sessionId');
    if(id){
      this.sessionId=id;
      this.getHistoryofChat();
    }
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  ngOnDestroy() {
    // Clean up event listeners
    window.removeEventListener('resize', () => this.checkScreenSize());
  }

  private checkScreenSize() {
    if (typeof window !== 'undefined') {
      this.isHistorySidebarOpen = window.innerWidth >= 1024; // lg breakpoint
      this.isPropertiesSidebarOpen = false; // Properties closed by default
    }
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.messages.push({
        type: 'user',
        content: this.searchQuery,
        timestamp: new Date()
      });
      
      this.isLoading = true;
      let requstObj;
        if(this.sessionId){
             requstObj={
       "session_id": this.sessionId,
       "query": this.searchQuery
    }
        }else{
      requstObj={
       "session_id": "",
       "query": this.searchQuery
    }
        }
     
      this.apiservice.getChatResponse(requstObj).subscribe(res=>{
       this.messages.push({
        type: 'assistant',
        content: res.answer,
        timestamp: new Date()
      });
      this.isSessionCreated=true;
      
      // Update session ID if it's a new session
      if (!this.sessionId) {
        this.sessionId = res.session_id;
        sessionStorage.setItem('sessionId', this.sessionId);
      }
      
      this.isLoading = false;
      },error=>{
        this.isLoading = false;
        console.error('Error getting chat response:', error);
      })
      
      this.searchQuery = '';
    }
  }

  getHistoryofChat(){
    this.apiservice.getHistoryofChat(this.sessionId).subscribe((res:any)=>{
     res.history.forEach((element :any) => {
        this.messages.push({   
        type: element.role,
        content:element.content,
        timestamp: new Date()
        })
      });
    },error=>{

    })
  }

  onSuggestionClick(suggestion: string) {
    this.searchQuery = suggestion;
  }

  clearChat() {
    this.messages = [];
    this.sessionId = null;
    this.isSessionCreated = false;
    sessionStorage.removeItem('sessionId');
  }

  toggleHistorySidebar() {
    this.isHistorySidebarOpen = !this.isHistorySidebarOpen;
    // Refresh history when sidebar is opened
    if (this.isHistorySidebarOpen) {
      setTimeout(() => {
        // Trigger a refresh in the save-history component
        this.refreshHistoryIfNeeded();
      }, 300);
    }
  }

  onExpandSidebar() {
    this.isHistorySidebarOpen = true;
    // Refresh history when sidebar is expanded
    setTimeout(() => {
      this.refreshHistoryIfNeeded();
    }, 300);
  }

  private refreshHistoryIfNeeded() {
    // This will trigger the ngOnChanges in save-history component
    // by updating the reference to currentMessages
    this.messages = [...this.messages];
  }

  togglePropertiesSidebar() {
    this.isPropertiesSidebarOpen = !this.isPropertiesSidebarOpen;
  }

  // Save History Event Handlers
  onLoadConversation(messages: any[]) {
    this.messages = [];
    messages.forEach(element => {
       this.messages.push({   
        type: element.role,
        content: element.content,
        timestamp: new Date()
        });
    });
    // Update session ID when loading a conversation
    if (messages.length > 0) {
      // You might need to get the session ID from the loaded conversation
      // This depends on your API structure
      this.isSessionCreated = true;
    }
    // Scroll to top of the chat
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }

  onClearCurrentChat() {
    this.clearChat();
  }

  // Upload functionality
  toggleUploadPopup() {
    this.isUploadPopupOpen = !this.isUploadPopupOpen;
  }

  closeUploadPopup() {
    this.isUploadPopupOpen = false;
  }

  onUploadImage() {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.handleFileUpload(file, 'image');
      }
    };
    
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
    this.closeUploadPopup();
  }

  onUploadDocument() {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx,.txt,.rtf';
    fileInput.style.display = 'none';
    
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.handleFileUpload(file, 'document');
      }
    };
    
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
    this.closeUploadPopup();
  }

  onUploadFromGoogleDrive() {
    // Placeholder for Google Drive integration
    console.log('Google Drive upload functionality would be implemented here');
    // In a real implementation, you would integrate with Google Drive API
    alert('Google Drive integration would be implemented here with proper API setup');
    this.closeUploadPopup();
  }

  private handleFileUpload(file: File, type: 'image' | 'document') {
    // Add a message showing the uploaded file
    const fileMessage = {
      type: 'user',
      content: `Uploaded ${type}: ${file.name}`,
      timestamp: new Date(),
      file: {
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file) // For preview purposes
      }
    };

    this.messages.push(fileMessage);

    // Simulate AI response to file upload
    setTimeout(() => {
      this.messages.push({
        type: 'assistant',
        content: `I can see you've uploaded a ${type}: "${file.name}". In a real implementation, I would analyze this file and provide relevant insights or answers based on its content.`,
        timestamp: new Date()
      });
    }, 1000);

    // Scroll to bottom
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  }

  // Close popup when clicking outside
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.upload-popup-container')) {
      this.closeUploadPopup();
    }
  }

  formatMessage(content: string): string {
    // Basic markdown-like formatting to match ChatGPT's style
    let formatted = content;
    
    // Format bold text
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Format italic text
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Format headers
    formatted = formatted.replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-white mb-3 mt-6">$1</h3>');
    formatted = formatted.replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-white mb-4 mt-6">$1</h2>');
    formatted = formatted.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-white mb-4 mt-6">$1</h1>');
    
    // Format numbered lists
    formatted = formatted.replace(/^(\d+)\.\s+(.*$)/gm, '<div class="numbered-list-item mb-2"><span class="font-semibold text-blue-400">$1.</span> $2</div>');
    
    // Format bullet points
    formatted = formatted.replace(/^[-*]\s+(.*$)/gm, '<div class="bullet-list-item mb-2 flex items-start"><span class="text-green-400 mr-2 mt-1">•</span><span>$1</span></div>');
    
    // Format inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-gray-700 text-green-400 px-2 py-1 rounded text-sm font-mono">$1</code>');
    
    // Format code blocks
    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-900 border border-gray-600 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-green-400 font-mono text-sm">$2</code></pre>');
    
    // Format links
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-blue-400 hover:text-blue-300 underline underline-offset-2">$1</a>');
    
    // Format line breaks
    formatted = formatted.replace(/\n\n/g, '</p><p class="mb-4">');
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Wrap in paragraph tags
    if (!formatted.includes('<h1>') && !formatted.includes('<h2>') && !formatted.includes('<h3>') && !formatted.includes('<div class="numbered-list-item">') && !formatted.includes('<div class="bullet-list-item">')) {
      formatted = '<p class="mb-4 leading-relaxed text-gray-100">' + formatted + '</p>';
    }
    
    return formatted;
  }
}
