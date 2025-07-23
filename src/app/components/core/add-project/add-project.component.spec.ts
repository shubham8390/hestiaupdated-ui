import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { AddProjectComponent } from './add-project.component';

describe('AddProjectComponent', () => {
  let component: AddProjectComponent;
  let fixture: ComponentFixture<AddProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddProjectComponent,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms on component creation', () => {
    expect(component.projectForm).toBeDefined();
    expect(component.milestoneForm).toBeDefined();
    expect(component.projectForm.valid).toBeFalsy();
  });

  it('should validate required fields', () => {
    const projectNameControl = component.projectForm.get('projectName');
    const descriptionControl = component.projectForm.get('description');
    const categoryControl = component.projectForm.get('category');

    expect(projectNameControl?.hasError('required')).toBeTruthy();
    expect(descriptionControl?.hasError('required')).toBeTruthy();
    expect(categoryControl?.hasError('required')).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.projectForm.get('clientEmail');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();

    emailControl?.setValue('valid@example.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should handle mobile view correctly', () => {
    // Test mobile view detection
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    
    component.ngOnInit();
    expect(component.isMobileView).toBe(true);
  });

  it('should add milestone correctly', () => {
    component.milestoneForm.patchValue({
      title: 'Test Milestone',
      description: 'Test Description',
      dueDate: '2024-12-31',
      status: 'pending',
      progress: 0
    });

    const initialLength = component.milestones.length;
    component.saveMilestone();
    
    expect(component.milestones.length).toBe(initialLength + 1);
    expect(component.milestones[0].title).toBe('Test Milestone');
  });

  it('should delete milestone correctly', () => {
    // Add a milestone first
    component.milestones = [{
      id: 'test-id',
      title: 'Test Milestone',
      description: 'Test Description',
      dueDate: '2024-12-31',
      status: 'pending',
      progress: 0
    }];

    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteMilestone('test-id');
    
    expect(component.milestones.length).toBe(0);
  });

  it('should handle file upload correctly', () => {
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const fileList = {
      0: file,
      length: 1,
      item: (index: number) => file
    } as FileList;

    component.handleDocumentFiles(fileList);
    
    expect(component.projectFiles.length).toBe(1);
    expect(component.projectFiles[0].name).toBe('test.pdf');
  });

  it('should validate file types correctly', () => {
    const validFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const invalidFile = new File(['test'], 'test.exe', { type: 'application/x-msdownload' });

    expect(component['isValidFileType'](validFile)).toBeTruthy();
    expect(component['isValidFileType'](invalidFile)).toBeFalsy();
  });

  it('should format file size correctly', () => {
    expect(component.formatFileSize(0)).toBe('0 Bytes');
    expect(component.formatFileSize(1024)).toBe('1 KB');
    expect(component.formatFileSize(1048576)).toBe('1 MB');
  });

  it('should generate unique IDs', () => {
    const id1 = component['generateId']();
    const id2 = component['generateId']();
    
    expect(id1).not.toBe(id2);
    expect(id1.length).toBeGreaterThan(0);
  });

  it('should handle form submission', () => {
    spyOn(component['router'], 'navigate');
    
    // Fill required fields
    component.projectForm.patchValue({
      projectName: 'Test Project',
      description: 'Test Description for project',
      category: 'residential',
      location: 'Test Location',
      budget: 100000,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      clientName: 'Test Client',
      clientEmail: 'test@example.com',
      clientPhone: '+1234567890'
    });

    component.onSubmit();
    
    expect(component.isSubmitting).toBeTruthy();
    
    // Wait for async operation
    setTimeout(() => {
      expect(component['router'].navigate).toHaveBeenCalledWith(['/manage-projects']);
    }, 2100);
  });

  it('should navigate back correctly', () => {
    spyOn(component['router'], 'navigate');
    component.goBack();
    expect(component['router'].navigate).toHaveBeenCalledWith(['/manage-projects']);
  });

  it('should get milestone status colors correctly', () => {
    expect(component.getMilestoneStatusColor('completed')).toBe('bg-green-600');
    expect(component.getMilestoneStatusColor('in-progress')).toBe('bg-yellow-600');
    expect(component.getMilestoneStatusColor('pending')).toBe('bg-gray-600');
  });

  it('should get priority colors correctly', () => {
    expect(component.getPriorityColor('high')).toBe('text-red-400');
    expect(component.getPriorityColor('medium')).toBe('text-yellow-400');
    expect(component.getPriorityColor('low')).toBe('text-green-400');
  });

  it('should handle sidebar toggles correctly', () => {
    const initialHistoryState = component.isHistorySidebarOpen;
    component.onToggleHistory();
    expect(component.isHistorySidebarOpen).toBe(!initialHistoryState);

    const initialPropertiesState = component.isPropertiesSidebarOpen;
    component.onToggleProperties();
    expect(component.isPropertiesSidebarOpen).toBe(!initialPropertiesState);
  });
}); 