import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavigationSidebarComponent } from '../../shared/navigation-sidebar/navigation-sidebar.component';
import { PropertyListingComponent } from '../property-listing/property-listing.component';
import { SaveHistoryComponent } from '../save-history/save-history.component';
import { ApiService } from '../Services/api.service';

@Component({
  selector: 'app-manage-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationSidebarComponent, PropertyListingComponent, SaveHistoryComponent],
  templateUrl: './manage-projects.component.html',
  styleUrl: './manage-projects.component.css'
})
export class ManageProjectsComponent implements OnInit {
  // Sidebar states
  isNavigationSidebarExpanded: boolean = true;
  isHistorySidebarOpen: boolean = false;
  isPropertiesSidebarOpen: boolean = false;
  isMobileView: boolean = false;
  
  // New properties for search and view toggle
  searchTerm: string = '';
  viewMode: 'card' | 'list' = 'card';
  projects: any[] = [];
  isLoading: boolean = true;
  
  constructor(private router: Router, private apiservice: ApiService) {}

  ngOnInit() {
    this.checkMobileView();
    this.getAllProject();

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

  // New methods
  toggleViewMode() {
    this.viewMode = this.viewMode === 'card' ? 'list' : 'card';
  }

  onSearch() {
    // Search functionality is handled by getFilteredProjects()
    // This method can be used for additional search logic if needed
  }

  addNewProject() {
    this.router.navigate(['/add-project']);
  }

  getFilteredProjects() {
    if (!this.searchTerm) {
      return this.projects;
    }
    
    return this.projects.filter((project: any) => 
      project.project_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  viewProjectDetails(projectId: any) {
    this.router.navigate(['/project-details', projectId]);
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
    this.router.navigate(['/chat']);
  }

  onClearCurrentChat() {
    // Navigate to chat UI to clear current chat
    this.router.navigate(['/chat']);
  }

  onNewChat() {
    this.router.navigate(['/chat']);
  }

  goBack() {
    this.router.navigate(['/chat']);
  }

  getAllProject() {
    this.isLoading = true;
    this.apiservice.getProjectList().subscribe(
      (res: any) => {
        this.projects = res;
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error loading projects:', error);
        this.isLoading = false;
        // You might want to show an error message to the user here
      }
    );
  }
}