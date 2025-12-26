import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserSettingsComponent } from '../user-settings/user-settings.component';

@Component({
  selector: 'app-navigation-sidebar',
  standalone: true,
  imports: [CommonModule, UserSettingsComponent],
  templateUrl: './navigation-sidebar.component.html',
  styleUrl: './navigation-sidebar.component.css'
})
export class NavigationSidebarComponent implements OnInit, OnDestroy {
  @Input() hasMessages: boolean = false;
  @Input() isHistorySidebarOpen: boolean = false;
  @Input() isPropertiesSidebarOpen: boolean = false;
  @Input() isExpanded: boolean = true;
  
  @Output() clearChatEvent = new EventEmitter<void>();
  @Output() toggleHistorySidebarEvent = new EventEmitter<void>();
  @Output() togglePropertiesSidebarEvent = new EventEmitter<void>();
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  @Output() newChatEvent = new EventEmitter<void>();

  // User settings popup state
  isUserSettingsOpen: boolean = false;

  // Discover dropdown state
  isDiscoverDropdownOpen: boolean = false;

  // Current route for highlighting active nav item
  currentRoute: string = '';

  // Mobile view detection
  isMobileView: boolean = false;
  
  // Hover state for desktop
  private isHovering: boolean = false;
  private originalExpandedState: boolean = true;

  constructor(private router: Router) {
    this.currentRoute = this.router.url;
    this.checkMobileView();
  }

  ngOnInit() {
    this.checkMobileView();
    // Start collapsed on desktop for hover-to-expand experience
    if (!this.isMobileView) {
      this.isExpanded = false;
    }
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkMobileView();
  }

  private checkMobileView() {
    if (typeof window !== 'undefined') {
      this.isMobileView = window.innerWidth < 1024; // lg breakpoint
      
      // On mobile, always start collapsed
      if (this.isMobileView && this.isExpanded) {
        this.isExpanded = false;
        this.toggleSidebarEvent.emit();
      }
      
      // On desktop, start collapsed by default
      if (!this.isMobileView && !this.isHovering) {
        this.originalExpandedState = this.isExpanded;
        this.isExpanded = false;
      }
    }
  }

  onMouseEnter() {
    if (!this.isMobileView) {
      this.isHovering = true;
      this.isExpanded = true;
    }
  }

  onMouseLeave() {
    if (!this.isMobileView) {
      this.isHovering = false;
      // Add a small delay to prevent flickering
      setTimeout(() => {
        if (!this.isHovering) {
          this.isExpanded = false;
        }
      }, 100);
    }
  }

  onClearChat() {
    this.clearChatEvent.emit();
  }

  onNewChat() {
    this.newChatEvent.emit();
  }

  onToggleHistorySidebar() {
    this.toggleHistorySidebarEvent.emit();
  }

  onTogglePropertiesSidebar() {
    this.togglePropertiesSidebarEvent.emit();
  }

  onToggleSidebar() {
    // Only allow manual toggle on mobile
    if (this.isMobileView) {
      this.toggleSidebarEvent.emit();
    }
  }

  onNavigate(route: string) {
    this.router.navigate([route]);
    this.currentRoute = route;
  }

  // User settings methods
  onToggleUserSettings() {
    debugger
    this.isUserSettingsOpen = !this.isUserSettingsOpen;
  }

  onCloseUserSettings() {
    this.isUserSettingsOpen = false;
  }

  // Discover dropdown methods
  onToggleDiscoverDropdown() {
    if (!this.isExpanded && !this.isMobileView) {
      // If sidebar is collapsed on desktop, expand it first and show dropdown
      this.toggleSidebarEvent.emit();
      setTimeout(() => {
        this.isDiscoverDropdownOpen = !this.isDiscoverDropdownOpen;
      }, 100);
    } else {
      this.isDiscoverDropdownOpen = !this.isDiscoverDropdownOpen;
    }
  }

  onDiscoverOptionSelect(option: string) {
    console.log('Selected discover option:', option);
    
    // Handle navigation based on the selected option
    switch(option) {
      case 'Manage Projects':
        this.router.navigate(['/manage-projects']);
        this.currentRoute = '/manage-projects';
        break;
      case 'Admin':
        // Add admin route navigation here when created
        console.log('Admin route not implemented yet');
        break;
      case 'Research':
        // Add research route navigation here when created
        console.log('Research route not implemented yet');
        break;
      case 'Users':
        // Add users route navigation here when created
        console.log('Users route not implemented yet');
        break;
      case 'Customers':
        this.router.navigate(['/customers']);
        this.currentRoute = '/customers';
        break;
    }
    
    this.isDiscoverDropdownOpen = false;
  }
} 