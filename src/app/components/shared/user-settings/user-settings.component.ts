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
  isDarkTheme: boolean = true; // Default to dark theme

  ngOnInit() {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('theme');
    this.isDarkTheme = savedTheme === 'dark' || savedTheme === null; // Default to dark if no preference
    this.applyTheme();
  }

  // Close popup when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-settings-popup') && !target.closest('.user-profile-button')) {
      this.closePopup.emit();
    }
  }

  onToggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
    this.applyTheme();
    console.log('Theme toggled to:', this.isDarkTheme ? 'dark' : 'light');
  }

  private applyTheme() {
    const htmlElement = document.documentElement;
    if (this.isDarkTheme) {
      htmlElement.classList.add('dark');
      htmlElement.classList.remove('light');
    } else {
      htmlElement.classList.add('light');
      htmlElement.classList.remove('dark');
    }
  }

  onSignOut() {
    console.log('Sign out clicked');
    if (confirm('Are you sure you want to sign out?')) {
      // Clear user session and any stored data
      localStorage.removeItem('userToken');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      // Add any other logout logic here
      console.log('User signed out successfully');
      this.closePopup.emit();
    }
  }
}
