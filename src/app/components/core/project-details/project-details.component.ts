import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NavigationSidebarComponent } from '../../shared/navigation-sidebar/navigation-sidebar.component';
import { PropertyListingComponent } from '../property-listing/property-listing.component';
import { SaveHistoryComponent } from '../save-history/save-history.component';

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
  createdDate?: string;
  completedDate?: string;
}

interface ProjectFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadDate: Date;
  category: 'image' | 'document' | 'spreadsheet' | 'presentation' | 'archive' | 'other';
}

interface ProjectData {
  id: number;
  projectName: string;
  description: string;
  category: string;
  location: string;
  budget: number;
  startDate: string;
  endDate: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  priority: 'low' | 'medium' | 'high';
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled';
  bannerImage?: string;
  profileImage?: string;
  documents: ProjectFile[];
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
  completionPercentage: number;
  teamMembers?: string[];
  tags?: string[];
  // Legacy fields for backward compatibility
  name?: string;
  image?: string;
  tag?: string;
  tagColor?: string;
  gradientColors?: string;
  fullDescription?: string;
  established?: string;
  teamSize?: number;
  specialties?: string[];
  phone?: string;
  email?: string;
  website?: string;
  completedProjects?: number;
  activeListings?: number;
  averagePrice?: string;
  clientSatisfaction?: number;
  awards?: string[];
  gallery?: string[];
  testimonials?: any[];
}

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, NavigationSidebarComponent, PropertyListingComponent, SaveHistoryComponent],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.css'
})
export class ProjectDetailsComponent implements OnInit {
  // Sidebar states
  isNavigationSidebarExpanded: boolean = true;
  isHistorySidebarOpen: boolean = false;
  isPropertiesSidebarOpen: boolean = false;
  isMobileView: boolean = false;
  
  // Project details
  projectId: number | null = null;
  project: ProjectData | null = null;
  isLoading: boolean = true;
  
  // Enhanced project data
  projects: ProjectData[] = [
    {
      id: 1,
      projectName: 'Elite Property Solutions - Luxury Development',
      description: 'Comprehensive luxury residential development project featuring high-end amenities and modern architectural design. This project encompasses multiple phases including planning, construction, and marketing of premium residential units.',
      category: 'residential',
      location: 'Downtown Metropolitan Area',
      budget: 2500000,
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      clientName: 'Elite Property Solutions Inc.',
      clientEmail: 'contact@elitepropertysolutions.com',
      clientPhone: '+1 (555) 123-4567',
      priority: 'high',
      status: 'in-progress',
      bannerImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop',
      profileImage: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=400&fit=crop',
      documents: [
        {
          id: 'doc1',
          name: 'Project_Blueprint_v2.pdf',
          type: 'application/pdf',
          size: 2048576,
          url: '#',
          uploadDate: new Date('2024-01-20'),
          category: 'document'
        },
        {
          id: 'doc2',
          name: 'Budget_Analysis.xlsx',
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          size: 524288,
          url: '#',
          uploadDate: new Date('2024-01-25'),
          category: 'spreadsheet'
        },
        {
          id: 'doc3',
          name: 'Design_Presentation.pptx',
          type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          size: 10485760,
          url: '#',
          uploadDate: new Date('2024-02-01'),
          category: 'presentation'
        },
        {
          id: 'doc4',
          name: 'Site_Survey_Photos.zip',
          type: 'application/zip',
          size: 15728640,
          url: '#',
          uploadDate: new Date('2024-02-05'),
          category: 'archive'
        }
      ],
      milestones: [
        {
          id: 'ms1',
          title: 'Project Planning & Design',
          description: 'Complete initial project planning, architectural designs, and obtain necessary permits',
          dueDate: '2024-03-15',
          status: 'completed',
          progress: 100,
          createdDate: '2024-01-15',
          completedDate: '2024-03-10'
        },
        {
          id: 'ms2',
          title: 'Foundation & Infrastructure',
          description: 'Excavation, foundation laying, and basic infrastructure setup including utilities',
          dueDate: '2024-06-30',
          status: 'in-progress',
          progress: 75,
          createdDate: '2024-01-15'
        },
        {
          id: 'ms3',
          title: 'Structural Development',
          description: 'Main building structure, framing, and roofing installation',
          dueDate: '2024-09-15',
          status: 'pending',
          progress: 0,
          createdDate: '2024-01-15'
        },
        {
          id: 'ms4',
          title: 'Interior & Finishing',
          description: 'Interior design implementation, flooring, fixtures, and final finishing touches',
          dueDate: '2024-11-30',
          status: 'pending',
          progress: 0,
          createdDate: '2024-01-15'
        },
        {
          id: 'ms5',
          title: 'Final Inspection & Handover',
          description: 'Final quality checks, client inspection, and project handover',
          dueDate: '2024-12-31',
          status: 'pending',
          progress: 0,
          createdDate: '2024-01-15'
        }
      ],
      createdAt: '2024-01-15',
      updatedAt: '2024-07-15',
      completionPercentage: 45,
      teamMembers: ['John Smith (Project Manager)', 'Sarah Johnson (Lead Architect)', 'Mike Chen (Construction Lead)', 'Emily Rodriguez (Interior Designer)'],
      tags: ['Luxury', 'Residential', 'High-End', 'Premium'],
      // Legacy compatibility
      name: 'Elite Property Solutions',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
      tag: 'Premium',
      tagColor: 'bg-purple-600',
      gradientColors: 'from-blue-600 to-purple-600'
    },
    {
      id: 2,
      projectName: 'Metropolitan Realty - Urban Development',
      description: 'Modern urban development project focusing on mixed-use commercial and residential spaces in the heart of downtown business district.',
      category: 'mixed-use',
      location: 'Central Business District',
      budget: 1800000,
      startDate: '2024-02-01',
      endDate: '2024-10-15',
      clientName: 'Metropolitan Realty Group',
      clientEmail: 'contact@metropolitanrealty.com',
      clientPhone: '+1 (555) 234-5678',
      priority: 'medium',
      status: 'in-progress',
      bannerImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=600&fit=crop',
      profileImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop',
      documents: [
        {
          id: 'doc5',
          name: 'Urban_Planning_Report.pdf',
          type: 'application/pdf',
          size: 3145728,
          url: '#',
          uploadDate: new Date('2024-02-10'),
          category: 'document'
        },
        {
          id: 'doc6',
          name: 'Commercial_Floor_Plans.dwg',
          type: 'application/dwg',
          size: 1572864,
          url: '#',
          uploadDate: new Date('2024-02-15'),
          category: 'document'
        }
      ],
      milestones: [
        {
          id: 'ms6',
          title: 'Urban Planning Approval',
          description: 'Obtain all necessary urban planning approvals and permits',
          dueDate: '2024-04-01',
          status: 'completed',
          progress: 100,
          createdDate: '2024-02-01',
          completedDate: '2024-03-25'
        },
        {
          id: 'ms7',
          title: 'Commercial Space Development',
          description: 'Develop commercial spaces on ground and first floors',
          dueDate: '2024-07-15',
          status: 'in-progress',
          progress: 60,
          createdDate: '2024-02-01'
        },
        {
          id: 'ms8',
          title: 'Residential Units Completion',
          description: 'Complete residential units on upper floors',
          dueDate: '2024-09-30',
          status: 'pending',
          progress: 0,
          createdDate: '2024-02-01'
        }
      ],
      createdAt: '2024-02-01',
      updatedAt: '2024-07-15',
      completionPercentage: 55,
      teamMembers: ['David Martinez (Project Lead)', 'Lisa Wang (Urban Planner)', 'Robert Kim (Commercial Designer)'],
      tags: ['Urban', 'Mixed-Use', 'Downtown', 'Commercial'],
      // Legacy compatibility
      name: 'Metropolitan Realty Group',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
      tag: 'Urban Focus',
      tagColor: 'bg-green-600',
      gradientColors: 'from-green-600 to-teal-600'
    },
    {
      id: 3,
      projectName: 'Coastal Properties - Waterfront Resort',
      description: 'Exclusive waterfront resort development with luxury amenities, marina access, and beachfront facilities.',
      category: 'commercial',
      location: 'Coastal Region - Oceanview Bay',
      budget: 3200000,
      startDate: '2024-03-01',
      endDate: '2025-01-31',
      clientName: 'Coastal Properties Inc.',
      clientEmail: 'info@coastalproperties.com',
      clientPhone: '+1 (555) 345-6789',
      priority: 'high',
      status: 'planning',
      bannerImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=600&fit=crop',
      profileImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
      documents: [
        {
          id: 'doc7',
          name: 'Environmental_Impact_Study.pdf',
          type: 'application/pdf',
          size: 5242880,
          url: '#',
          uploadDate: new Date('2024-03-10'),
          category: 'document'
        },
        {
          id: 'doc8',
          name: 'Marina_Design_Specs.pdf',
          type: 'application/pdf',
          size: 2097152,
          url: '#',
          uploadDate: new Date('2024-03-15'),
          category: 'document'
        }
      ],
      milestones: [
        {
          id: 'ms9',
          title: 'Environmental Clearance',
          description: 'Complete environmental impact assessment and obtain clearance',
          dueDate: '2024-05-01',
          status: 'in-progress',
          progress: 80,
          createdDate: '2024-03-01'
        },
        {
          id: 'ms10',
          title: 'Marina Construction',
          description: 'Build marina facilities and boat access infrastructure',
          dueDate: '2024-08-15',
          status: 'pending',
          progress: 0,
          createdDate: '2024-03-01'
        }
      ],
      createdAt: '2024-03-01',
      updatedAt: '2024-07-15',
      completionPercentage: 20,
      teamMembers: ['Jennifer Taylor (Marine Engineer)', 'Carlos Rodriguez (Environmental Specialist)', 'Anna Peterson (Resort Designer)'],
      tags: ['Waterfront', 'Resort', 'Marina', 'Luxury'],
      // Legacy compatibility
      name: 'Coastal Properties Inc',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
      tag: 'Waterfront',
      tagColor: 'bg-cyan-600',
      gradientColors: 'from-cyan-600 to-blue-600'
    },
    {
      id: 4,
      projectName: 'Heritage Estate - Historic Renovation',
      description: 'Comprehensive renovation and restoration of historic estate property while preserving architectural heritage and adding modern amenities.',
      category: 'residential',
      location: 'Historic District - Heritage Avenue',
      budget: 4100000,
      startDate: '2024-01-01',
      endDate: '2024-11-30',
      clientName: 'Heritage Estate Partners',
      clientEmail: 'contact@heritageestate.com',
      clientPhone: '+1 (555) 456-7890',
      priority: 'high',
      status: 'in-progress',
      bannerImage: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=600&fit=crop',
      profileImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=400&fit=crop',
      documents: [
        {
          id: 'doc9',
          name: 'Historical_Assessment_Report.pdf',
          type: 'application/pdf',
          size: 4194304,
          url: '#',
          uploadDate: new Date('2024-01-05'),
          category: 'document'
        },
        {
          id: 'doc10',
          name: 'Restoration_Guidelines.docx',
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          size: 1048576,
          url: '#',
          uploadDate: new Date('2024-01-10'),
          category: 'document'
        }
      ],
      milestones: [
        {
          id: 'ms11',
          title: 'Historical Assessment',
          description: 'Complete detailed assessment of historical significance and preservation requirements',
          dueDate: '2024-02-28',
          status: 'completed',
          progress: 100,
          createdDate: '2024-01-01',
          completedDate: '2024-02-25'
        },
        {
          id: 'ms12',
          title: 'Structural Restoration',
          description: 'Restore original structural elements while maintaining historical integrity',
          dueDate: '2024-06-30',
          status: 'in-progress',
          progress: 70,
          createdDate: '2024-01-01'
        },
        {
          id: 'ms13',
          title: 'Modern Amenity Integration',
          description: 'Seamlessly integrate modern amenities without compromising historical character',
          dueDate: '2024-10-15',
          status: 'pending',
          progress: 0,
          createdDate: '2024-01-01'
        }
      ],
      createdAt: '2024-01-01',
      updatedAt: '2024-07-15',
      completionPercentage: 65,
      teamMembers: ['Margaret Thompson (Historic Preservation Specialist)', 'Antonio Silva (Restoration Architect)', 'James Wilson (Structural Engineer)'],
      tags: ['Historic', 'Restoration', 'Heritage', 'Preservation'],
      // Legacy compatibility
      name: 'Heritage Estate Partners',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
      tag: 'Historic',
      tagColor: 'bg-amber-600',
      gradientColors: 'from-amber-600 to-orange-600'
    }
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.checkMobileView();
    // Start collapsed on desktop for hover-to-expand experience
    if (!this.isMobileView) {
      this.isNavigationSidebarExpanded = false;
    }

    // Get project ID from route params
    this.route.params.subscribe(params => {
      const id = parseInt(params['id']);
      if (id) {
        this.projectId = id;
        this.loadProject(id);
      }
    });
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

  loadProject(id: number) {
    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      this.project = this.projects.find(p => p.id === id) || null;
      this.isLoading = false;
    }, 500);
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
    this.router.navigate(['/manage-projects']);
  }

  editProject() {
    // Navigate to edit form (could be the same as add-project with edit mode)
    this.router.navigate(['/add-project'], { queryParams: { edit: this.projectId } });
  }

  // Helper methods for template
  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'bg-green-600';
      case 'in-progress': return 'bg-blue-600';
      case 'on-hold': return 'bg-yellow-600';
      case 'planning': return 'bg-purple-600';
      case 'cancelled': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-900/30';
      case 'medium': return 'text-yellow-400 bg-yellow-900/30';
      case 'low': return 'text-green-400 bg-green-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  }

  getMilestoneStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'bg-green-600';
      case 'in-progress': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  }

  getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';
      case 'doc':
      case 'docx': return 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z';
      case 'xls':
      case 'xlsx': return 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z';
      case 'ppt':
      case 'pptx': return 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z';
      case 'zip':
      case 'rar': return 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2m8 0V2a2 2 0 0 0-2-2H10a2 2 0 0 0-2 2v2m8 0H8';
      default: return 'M13 2L3 14h9l-1 8 10-12h-9l1-8z';
    }
  }

  getFileTypeColor(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'text-red-400';
      case 'doc':
      case 'docx': return 'text-blue-400';
      case 'xls':
      case 'xlsx': return 'text-green-400';
      case 'ppt':
      case 'pptx': return 'text-orange-400';
      case 'zip':
      case 'rar': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  }

  calculateDaysRemaining(endDate: string): number {
    const today = new Date();
    const end = new Date(endDate);
    const timeDiff = end.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  calculateProjectDuration(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  downloadDocument(document: ProjectFile) {
    // In a real application, this would trigger a download
    console.log('Downloading document:', document.name);
    // You could open the URL in a new window or trigger a download
    // window.open(document.url, '_blank');
  }
} 