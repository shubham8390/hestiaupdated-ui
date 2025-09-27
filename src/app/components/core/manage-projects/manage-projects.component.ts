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
  projects:any=[]
  // Project data
  // projects = [
  //   {
  //     id: 1,
  //     name: 'Elite Property Solutions',
  //     description: 'Specializing in luxury residential and commercial properties. Our expert team delivers exceptional results with personalized service and market expertise.',
  //     image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
  //     tag: 'Premium',
  //     tagColor: 'bg-purple-600',
  //     gradientColors: 'from-blue-600 to-purple-600'
  //   },
  //   {
  //     id: 2,
  //     name: 'Metropolitan Realty Group',
  //     description: 'Urban property specialists focusing on downtown developments and metropolitan investments. Leading the way in modern real estate solutions.',
  //     image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
  //     tag: 'Urban Focus',
  //     tagColor: 'bg-green-600',
  //     gradientColors: 'from-green-600 to-teal-600'
  //   },
  //   {
  //     id: 3,
  //     name: 'Coastal Properties Inc',
  //     description: 'Waterfront and coastal property experts with over 15 years of experience. Specializing in beachfront homes and vacation rentals.',
  //     image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
  //     tag: 'Waterfront',
  //     tagColor: 'bg-cyan-600',
  //     gradientColors: 'from-cyan-600 to-blue-600'
  //   },
  //   {
  //     id: 4,
  //     name: 'Heritage Estate Partners',
  //     description: 'Boutique real estate firm specializing in historic properties and family estates. Preserving architectural heritage while maximizing investment potential.',
  //     image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
  //     tag: 'Historic',
  //     tagColor: 'bg-amber-600',
  //     gradientColors: 'from-amber-600 to-orange-600'
  //   }
  // ];


  
  constructor(private router: Router,private apiservice:ApiService) {}

  ngOnInit() {
    debugger
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
    
    return this.projects.filter((project:any) => 
      project.project_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  viewProjectDetails(projectId: any) {
    debugger
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

  getAllProject(){
    this.apiservice.getProjectList().subscribe(res=>{
      this.projects=res;
    },error=>{

    })
  }
}
