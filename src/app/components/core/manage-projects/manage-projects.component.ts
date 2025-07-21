import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationSidebarComponent } from '../../shared/navigation-sidebar/navigation-sidebar.component';
import { PropertyListingComponent } from '../property-listing/property-listing.component';
import { SaveHistoryComponent } from '../save-history/save-history.component';

@Component({
  selector: 'app-manage-projects',
  standalone: true,
  imports: [CommonModule, NavigationSidebarComponent, PropertyListingComponent, SaveHistoryComponent],
  templateUrl: './manage-projects.component.html',
  styleUrl: './manage-projects.component.css'
})
export class ManageProjectsComponent implements OnInit {
  // Sidebar states
  isNavigationSidebarExpanded: boolean = true;
  isHistorySidebarOpen: boolean = false;
  isPropertiesSidebarOpen: boolean = false;
  isMobileView: boolean = false;
  
  constructor(private router: Router) {}

  ngOnInit() {
    this.checkMobileView();
    // Start collapsed on desktop for hover-to-expand experience
    if (!this.isMobileView) {
      this.isNavigationSidebarExpanded = false;
    }
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
  }

  onClearChat() {
    // No chat functionality on this page
  }

  onToggleHistory() {
    this.isHistorySidebarOpen = !this.isHistorySidebarOpen;
  }

  onToggleProperties() {
    this.isPropertiesSidebarOpen = !this.isPropertiesSidebarOpen;
  }

  onLoadConversation(messages: any[]) {
    // Navigate to chat UI with loaded conversation
    this.router.navigate(['/']);
  }

  onClearCurrentChat() {
    // Navigate to chat UI to clear current chat
    this.router.navigate(['/']);
  }

  onNewChat() {
    this.router.navigate(['/']);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
