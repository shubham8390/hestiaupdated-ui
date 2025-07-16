import { Component, Input, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.css'
})
export class UserSettingsComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Output() closePopup = new EventEmitter<void>();
  
  userEmail: string = 'shubs390@gmail.com';
  userName: string = 'Shubham';

  ngOnInit() {
    // You can load user data from a service here
  }

  // Close popup when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-settings-popup') && !target.closest('.user-profile-button')) {
      this.closePopup.emit();
    }
  }

  onUpgradePlan() {
    console.log('Upgrade plan clicked');
    // Implement upgrade plan logic
    this.closePopup.emit();
  }

  onCustomizeChatGPT() {
    console.log('Customize ChatGPT clicked');
    // Implement customization logic
    this.closePopup.emit();
  }

  onSettings() {
    console.log('Settings clicked');
    // Implement settings logic
    this.closePopup.emit();
  }

  onHelp() {
    console.log('Help clicked');
    // Implement help logic
    this.closePopup.emit();
  }

  onLogOut() {
    console.log('Log out clicked');
    // Implement logout logic
    if (confirm('Are you sure you want to log out?')) {
      // Clear user session, redirect to login, etc.
      this.closePopup.emit();
    }
  }
}
