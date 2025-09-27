import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationSidebarComponent } from '../../shared/navigation-sidebar/navigation-sidebar.component';
import { PropertyListingComponent } from '../property-listing/property-listing.component';
import { SaveHistoryComponent } from '../save-history/save-history.component';
import { ApiService } from '../Services/api.service';
import { ToastrService } from 'ngx-toastr';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  joinDate?: string;
  isActive?: boolean;
}

interface Units {
  unit_type: string;
  unit_size: string;
  unit_price_low: string;
  unit_price_high: string;
  unit_available: string;
  unit_total: string;
  unit_sold: string;

}

interface Milestone {
  id: string;
  title: string;
  description: string;
  due_date: string;
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
}




interface ProjectFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadDate: Date;
}

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NavigationSidebarComponent, PropertyListingComponent, SaveHistoryComponent],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css'
})
export class AddProjectComponent implements OnInit {
  // Sidebar states
  isNavigationSidebarExpanded: boolean = true;
  isHistorySidebarOpen: boolean = false;
  isPropertiesSidebarOpen: boolean = false;
  isMobileView: boolean = false;

  // Form and data
  projectForm!: FormGroup;
  milestones: Milestone[] = [];
  projectFiles: ProjectFile[] = [];
  teamMembers: any[] = [];
  units: Units[] = [];

  // form for add units

  // File upload states
  bannerImageFile: File | null = null;
  profileImageFile: File | null = null;
  bannerImagePreview: string | null = null;
  profileImagePreview: string | null = null;

  // UI states
  isSubmitting: boolean = false;
  showMilestoneForm: boolean = false;
  showunitsForm: boolean = false;
  editingMilestone: Milestone | null = null;
  editingunits: Units | null = null;
  dragActive: boolean = false;

  showMemberForm: boolean = false;
  editingMember: TeamMember | null = null;

  // Milestone form
  milestoneForm!: FormGroup;
  memberForm!: FormGroup;
  unitsForm!: FormGroup;

  bannerImageId: any
  profileImageId: any
  knowledgeId: any

  projecteditId: any
  projectData: any
  isEdit: boolean = false;

  // Accepted file types
  acceptedDocumentTypes = [
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
    '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp',
    '.zip', '.rar', '.txt', '.csv'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiservice: ApiService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.initializeForms();
  }

  ngOnInit() {
    debugger
    const editId = this.route.snapshot.queryParamMap.get('edit');
    if (editId) {
      this.projecteditId = editId;
      this.isEdit = true;
      this.getProjectDetails(this.projecteditId);
    }

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

  private initializeForms() {
    // Main project form
    this.projectForm = this.fb.group({
      projectName: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      location: ['', Validators.required],
      budget: ['', [Validators.required, Validators.min(0)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      clientName: [''],
      clientEmail: ['', Validators.email],
      clientPhone: [''],
      priority: ['medium', Validators.required],
      status: ['planning', Validators.required]
    });

    // Milestone form
    this.milestoneForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      due_date: ['', Validators.required],
      status: ['pending', Validators.required],
      progress: [0, [Validators.min(0), Validators.max(100)]]
    });

    this.memberForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      designation: ['', Validators.required]
    });

    this.unitsForm = this.fb.group({
      unit_type: ['', Validators.required],
      unit_size: [0, Validators.required],
      unit_price_low: [0, Validators.required],
      unit_price_high: [0, Validators.required],
      unit_available: [0, [Validators.min(0)]],
      unit_total: [0, [Validators.min(0)]],
      unit_sold: [0, [Validators.min(0)]]
    });
  }

  // Sidebar methods
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
    this.router.navigate(['/chat']);
  }

  onClearCurrentChat() {
    this.router.navigate(['/chat']);
  }

  onNewChat() {
    this.router.navigate(['/chat']);
  }

  goBack() {
    this.router.navigate(['/manage-projects']);
  }

  // File upload methods
  onBannerImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.bannerImageFile = input.files[0];
      this.apiservice.uploadImage(this.bannerImageFile).subscribe(res => {
        this.bannerImageId = res.image_id
      }, error => {

      })
      this.createImagePreview(input.files[0], 'banner');
    }
  }

  onProfileImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.profileImageFile = input.files[0];
      this.apiservice.uploadImage(this.profileImageFile).subscribe(res => {
        this.profileImageId = res.image_id
      }, error => {

      })
      this.createImagePreview(input.files[0], 'profile');
    }
  }

  private createImagePreview(file: File, type: 'banner' | 'profile') {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'banner') {
        this.bannerImagePreview = e.target?.result as string;
      } else {
        this.profileImagePreview = e.target?.result as string;
      }
    };
    reader.readAsDataURL(file);
  }

  // Document upload methods
  onDocumentDrop(event: DragEvent) {
    event.preventDefault();
    this.dragActive = false;

    if (event.dataTransfer && event.dataTransfer.files) {
      this.handleDocumentFiles(event.dataTransfer.files);
    }
  }

  onDocumentDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragActive = true;
  }

  onDocumentDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragActive = false;
  }

  onDocumentChange(event: Event) {
    const input = event.target as HTMLInputElement;
    debugger
    if (input.files) {

      this.apiservice.uploadDocuments(input.files[0]).subscribe(res => {
        this.knowledgeId = res.knowledge_id;
      }, error => {
      })

      this.handleDocumentFiles(input.files);
    }
  }

  private handleDocumentFiles(files: FileList) {
    Array.from(files).forEach(file => {
      if (this.isValidFileType(file)) {
        const projectFile: ProjectFile = {
          id: this.generateId(),
          name: file.name,
          type: file.type,
          size: file.size,
          url: URL.createObjectURL(file),
          uploadDate: new Date()
        };
        this.projectFiles.push(projectFile);
      } else {

        this.toastr.warning('File type ${file.type} is not supported');

      }
    });
  }

  private isValidFileType(file: File): boolean {
    const fileName = file.name.toLowerCase();
    return this.acceptedDocumentTypes.some(type => fileName.endsWith(type));
  }

  removeDocument(fileId: string) {
    const index = this.projectFiles.findIndex(f => f.id === fileId);
    if (index > -1) {
      URL.revokeObjectURL(this.projectFiles[index].url);
      this.projectFiles.splice(index, 1);
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
      default: return 'M13 2L3 14h9l-1 8 10-12h-9l1-8z';
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Milestone management methods
  openMilestoneForm(milestone?: Milestone) {
    debugger
    if (milestone) {
      this.editingMilestone = milestone;
      this.milestoneForm.patchValue(milestone);
    } else {
      this.editingMilestone = null;
      this.milestoneForm.reset({
        status: 'pending',
        progress: 0
      });
    }
    this.showMilestoneForm = true;
  }



  closeMilestoneForm() {
    this.showMilestoneForm = false;
    this.editingMilestone = null;
    this.milestoneForm.reset();
  }

  openaddunitsform(units?: Units) {
    if (units) {
      this.editingunits = units;
      this.unitsForm.patchValue(units);
    }
    else {
      this.editingunits = null;
      this.unitsForm.reset();
    }
    this.showunitsForm = true;
  }
  closeunitsform() {
    debugger
    this.showunitsForm = false;
    this.unitsForm.reset();

  }
  saveunit() {
    debugger
    if (this.unitsForm.valid) {
      const unitsData = this.unitsForm.value;

      if (this.editingunits) {
        const index = this.units.findIndex(m => m.unit_type === this.editingunits!.unit_type);
        if (index > -1) {
          this.units[index] = { ...this.editingunits, ...unitsData };
        }
      }
      else {
        const newMilestone: Units = {
          ...unitsData
        };
        this.units.push(unitsData);
      }

    }
    else {
      this.toastr.error("Enter Valid entries")
    }
    this.closeunitsform();

    ////
    if (this.milestoneForm.valid) {
      const milestoneData = this.milestoneForm.value;
      debugger
      if (this.editingMilestone) {
        // Update existing milestone
        const index = this.milestones.findIndex(m => m.title === this.editingMilestone!.title);
        if (index > -1) {
          this.milestones[index] = { ...this.editingMilestone, ...milestoneData };
        }
      } else {
        // Add new milestone
        const newMilestone: Milestone = {
          ...milestoneData
        };
        this.milestones.push(newMilestone);
      }

      this.closeMilestoneForm();
    }
  }

  deleteUnits(unit_type: string) {
    if (confirm('Are you sure you want to delete this milestone?')) {
      this.units = this.units.filter(m => m.unit_type !== unit_type);
    }
  }


  saveMilestone() {
    debugger
    if (this.milestoneForm.valid) {
      const milestoneData = this.milestoneForm.value;
      debugger
      if (this.editingMilestone) {
        // Update existing milestone
        const index = this.milestones.findIndex(m => m.title === this.editingMilestone!.title);
        if (index > -1) {
          this.milestones[index] = { ...this.editingMilestone, ...milestoneData };
        }
      } else {
        // Add new milestone
        const newMilestone: Milestone = {
          ...milestoneData
        };
        this.milestones.push(newMilestone);
      }

      this.closeMilestoneForm();
    }
  }

  deleteMilestone(milestoneId: string) {
    if (confirm('Are you sure you want to delete this milestone?')) {
      debugger
      this.milestones = this.milestones.filter(m => m.title !== milestoneId);
    }
  }

  // Team Member Management Methods
  openMemberForm(member?: TeamMember) {
    this.editingMember = member || null;
    this.showMemberForm = true;

    if (member) {
      this.memberForm.patchValue({
        name: member.name,
        email: member.email,
        phone: member.phone,
        designation: member.designation
      });
    } else {
      this.memberForm.reset();
    }
  }

  closeMemberForm() {
    this.showMemberForm = false;
    this.editingMember = null;
    this.memberForm.reset();
  }

  saveMember() {
    if (this.memberForm.valid) {
      const memberData = this.memberForm.value;

      if (this.editingMember) {
        // Update existing member
        const index = this.teamMembers.findIndex(m => m.email === this.editingMember!.email);
        if (index !== -1) {
          this.teamMembers[index] = {
            ...this.editingMember,
            ...memberData
          };
        }
      } else {
        // Add new member
        const newMember = {
          name: memberData.name,
          email: memberData.email,
          phone: memberData.phone,
          designation: memberData.designation,
        };
        this.teamMembers.push(newMember);
      }

      this.closeMemberForm();
    }
  }

  deleteMember(memberId: string) {
    this.teamMembers = this.teamMembers.filter(member => member.email !== memberId);
  }

  toggleMemberStatus(memberId: string) {
    const member = this.teamMembers.find(m => m.email === memberId);
    if (member) {
      member.isActive = !member.isActive;
    }
  }

  // Helper method to get member status color
  getMemberStatusColor(isActive: boolean): string {
    return isActive ? 'bg-green-600' : 'bg-gray-600';
  }

  // Helper method to get member initials
  getMemberInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  // Helper method to get member active status safely
  isMemberActive(member: TeamMember): boolean {
    return member.isActive ?? true;
  }

  // Helper method to get designation color
  getDesignationColor(designation: string): string {
    const designationColors: { [key: string]: string } = {
      'project manager': 'text-purple-400 bg-purple-900/30',
      'architect': 'text-blue-400 bg-blue-900/30',
      'engineer': 'text-green-400 bg-green-900/30',
      'designer': 'text-pink-400 bg-pink-900/30',
      'developer': 'text-yellow-400 bg-yellow-900/30',
      'consultant': 'text-cyan-400 bg-cyan-900/30',
      'manager': 'text-indigo-400 bg-indigo-900/30',
      'lead': 'text-orange-400 bg-orange-900/30'
    };

    const key = designation.toLowerCase();
    return designationColors[key] || 'text-gray-400 bg-gray-900/30';
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // Form submission
  onSubmit() {
    if (this.projectForm.valid) {
      this.isSubmitting = true;

      // Simulate API call
      setTimeout(() => {

        let projectData = {
          "project_name": this.projectForm.value.projectName,
          "description": this.projectForm.value.description,
          "category": this.projectForm.value.category,
          "location": this.projectForm.value.location,
          "banner_id": this.bannerImageId || '',
          "image_id": this.profileImageId,
          "user_id": "6872166531b8abcca37c2d2c",
          "start_date": this.projectForm.value.startDate,
          "end_date": this.projectForm.value.endDate,
          "priority": this.projectForm.value.priority,
          "status": this.projectForm.value.status,
          "knowledge_id": this.knowledgeId || '',
          "budget": this.projectForm.value.budget,
          "milestones": this.milestones || [],
          "units": this.units || [],
          "team_members": this.teamMembers || []
        }


        if (this.isEdit) {
          this.apiservice.updateProject(projectData, this.projecteditId).subscribe(res => {
            this.toastr.success('project Updated Succesfully', 'Success');

          }, error => {

          })
        } else {
          this.apiservice.savedProject(projectData).subscribe(res => {
            this.toastr.success('Project Saved Succesfully', 'Success');
            this.router.navigate(['/createtask'], { queryParams: { projectId: res.id } });

          }, error => {
            this.toastr.warning('unable to save project');

          })
        }


        this.isSubmitting = false;
        // Navigate back to manage projects

      }, 2000);
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.projectForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.projectForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.projectForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} is too short`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['min']) return `${fieldName} must be greater than 0`;
    }
    return '';
  }

  getMilestoneStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'bg-green-600';
      case 'in-progress': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  }

  getProjectDetails(projectId: any) {
    this.apiservice.getProjectDetails(projectId).subscribe(res => {
      this.projectData = res;
      this.bindProjectData(this.projectData)
    }, error => {

    })
  }

  bindProjectData(projectData: any) {
    this.milestones = projectData.milestones;
    this.units = projectData.units;
    this.teamMembers = projectData.team_members;
    this.knowledgeId = projectData.knowledge_id;
    this.profileImageId = projectData.banner_id;
    this.bannerImageId = projectData.image_id;

    this.projectForm.patchValue({
      projectName: projectData.project_name,
      description: projectData.description,
      category: projectData.category,
      location: projectData.location,
      // Assuming you want to store banner_id and image_id separately
      // If these are in the form, add them too
      startDate: projectData.start_date,
      endDate: projectData.end_date,
      priority: projectData.priority,
      status: projectData.status,
      budget: projectData.budget
      // Optional fields (if you have these controls)
      // clientName: projectData.client_name,
      // clientEmail: projectData.client_email,
      // clientPhone: projectData.client_phone,
    });




  }
} 