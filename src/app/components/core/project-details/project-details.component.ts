import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NavigationSidebarComponent } from '../../shared/navigation-sidebar/navigation-sidebar.component';
import { PropertyListingComponent } from '../property-listing/property-listing.component';
import { SaveHistoryComponent } from '../save-history/save-history.component';
import { ApiService } from '../Services/api.service';
import { ToastrService } from 'ngx-toastr';

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


@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, NavigationSidebarComponent, PropertyListingComponent, SaveHistoryComponent],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.css'
})
export class ProjectDetailsComponent implements OnInit {
  getStarArray(arg0: number) {
    throw new Error('Method not implemented.');
  }
  getEmptyStarArray(arg0: number) {
    throw new Error('Method not implemented.');
  }
  // Sidebar states
  isNavigationSidebarExpanded: boolean = true;
  isHistorySidebarOpen: boolean = false;
  isPropertiesSidebarOpen: boolean = false;
  isMobileView: boolean = false;

  // Project details
  projectId: number | null = null;
  project: any | null = null;
  isLoading: boolean = true;

  // Delete confirmation popup state
  showDeleteConfirmation: boolean = false;

  ChatMessage: any

  constructor(private router: Router, private route: ActivatedRoute, private apiservice: ApiService, private toastr: ToastrService) { }

  // Pratik -------------------


  allTask: any;

  gettask(id: any) {
    debugger
    this.apiservice.getalltaskofProject(id).subscribe(res => {
      this.allTask = res;
      console.log("Pratik" + res)
    },
    )

  }

  addTask(id: any) {
    // Implementation for adding a new task
  }

  updateTask(task: any) {
   this.router.navigate(['/updatetask'], { queryParams: { taskId: task } });
  }

  deleteTask(taskId: string) {

    // Implementation for deleting a task

    debugger
    this.apiservice.deleteTaskbyId(taskId).subscribe(res => {
      this.toastr.success("Task Deletes Successfully")
      this.gettask(this.projectId);
    },
    )

  }

  moveTask(taskId: string, newStatus: string) {
    // Implementation for moving tasks between statuses
  }





  //----------------------

  ngOnInit() {
    debugger
    this.checkMobileView();
    // Start collapsed on desktop for hover-to-expand experience
    if (!this.isMobileView) {
      this.isNavigationSidebarExpanded = false;
    }
    debugger

    // Get project ID from route params
    this.route.params.subscribe(params => {
      this.projectId = params['id']
      if (this.projectId) {
        this.loadProject(this.projectId);
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
    // setTimeout(() => {
    //   this.project = this.projects.find((p:any) => p.id == id) || null;
    //   this.isLoading = false;
    // }, 500);


    this.apiservice.getProjectDetails(id).subscribe(res => {
      this.project = res;
      this.isLoading = false;
    }, error => {

    })



    setTimeout(() => {
      this.apiservice.getchatHistoryList(id).subscribe(res => {
        this.ChatMessage = res;
        this.calculateProjectCompletion()
      },
      )
    }, 200);

    this.gettask(id)


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
    this.router.navigate(['/manage-projects']);
  }

  editProject(projectId: any) {
    debugger
    // Navigate to edit form (could be the same as add-project with edit mode)
    this.router.navigate(['/add-project'], { queryParams: { edit: projectId } });
  }
  calculateEmi(projectId: any){
    this.router.navigate(['/emicalculator'], { queryParams: { edit: projectId } });
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
      currency: 'INR',
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

 chatProject(projectId: any) {
    this.router.navigate(['/chat'], { queryParams: { projectId: projectId } });
  }

  // Delete project methods
  openDeleteConfirmation() {
    this.showDeleteConfirmation = true;
  }

  closeDeleteConfirmation() {
    this.showDeleteConfirmation = false;
  }

  confirmDeleteProject() {
    if (this.project) {
      // In a real application, this would call an API to delete the project
      console.log('Deleting project:', this.project.projectName);

      // For now, just close the popup and navigate back to projects list
      this.showDeleteConfirmation = false;
      this.router.navigate(['/manage-projects']);

      this.apiservice.deleteProject(this.project._id).subscribe(res => {
        this.toastr.success("Project Deleted Successfully..")
      })
    }
  }


  loadChatHistory(sessionId: any, project_id: any) {
    sessionStorage.setItem('sessionId', sessionId)
    this.router.navigate(['/chat'], { queryParams: { projectId: project_id } });
  }

  completionPercentage: any
  calculateProjectCompletion(): void {
    const milestones = this.project?.milestones;
    if (!Array.isArray(milestones) || milestones.length === 0) {
      this.completionPercentage = 0;
      return;
    }

    const total = milestones.reduce((sum: number, m: any) => {
      const progressNum = typeof m.progress === 'number' ? m.progress : 0;
      // clamp between 0 and 100 in case of out-of-range values
      const normalized = Math.min(100, Math.max(0, progressNum));
      return sum + normalized;
    }, 0);

    // average and round to 2 decimals
    this.completionPercentage = parseFloat((total / milestones.length).toFixed(2));
  }


  addtask(id:any){
  this.router.navigate(['/createtask'], { queryParams: { projectId: id } });
  }

  //P
  addcustomer(id:any , name:any){
      this.router.navigate(['/addCustomer']);
  }
} 