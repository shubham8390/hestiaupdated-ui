import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
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
}
