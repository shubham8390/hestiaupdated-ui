import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserSettingsComponent } from '../user-settings/user-settings.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, UserSettingsComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() hasMessages: boolean = false;
  @Input() isHistorySidebarOpen: boolean = false;
  @Input() isPropertiesSidebarOpen: boolean = false;
  
  @Output() clearChatEvent = new EventEmitter<void>();
  @Output() toggleHistorySidebarEvent = new EventEmitter<void>();
  @Output() togglePropertiesSidebarEvent = new EventEmitter<void>();

  // User settings popup state
  isUserSettingsOpen: boolean = false;

  // Discover dropdown state
  isDiscoverDropdownOpen: boolean = false;

  constructor(private router: Router) {}

  onClearChat() {
    this.clearChatEvent.emit();
  }

  onToggleHistorySidebar() {
    this.toggleHistorySidebarEvent.emit();
  }

  onTogglePropertiesSidebar() {
    this.togglePropertiesSidebarEvent.emit();
  }

  // User settings methods
  onToggleUserSettings() {
    this.isUserSettingsOpen = !this.isUserSettingsOpen;
  }

  onCloseUserSettings() {
    this.isUserSettingsOpen = false;
  }

  // Discover dropdown methods
  onToggleDiscoverDropdown() {
    this.isDiscoverDropdownOpen = !this.isDiscoverDropdownOpen;
  }

  onDiscoverOptionSelect(option: string) {
    console.log('Selected discover option:', option);
    
    // Handle navigation based on the selected option
    switch(option) {
      case 'Manage Projects':
        this.router.navigate(['/manage-projects']);
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
        break;
    }
    
    this.isDiscoverDropdownOpen = false;
  }
}
