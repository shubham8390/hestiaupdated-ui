import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { ApiService } from '../Services/api.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

interface Task {
  id: number;
  name: string;
  status: string;
  priority: string;
  assignee: string;
  due_date: string;
  description: string;
  comments: string[];
  labels: string[];
  project_id: string;
}

@Component({
  selector: 'app-project-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CdkDropList, CdkDrag],
  templateUrl: './project-task.component.html',
  styleUrls: ['./project-task.component.css']
})
export class ProjectTaskComponent implements OnInit {
  // Board View Data
  todo: Task[] = [];
  inProgress: Task[] = [];
  done: Task[] = [];
  
  // Form Data
  projectForm!: FormGroup;
  projectId: any;
  taskId: any;
  taskData: any;
  isUpdate: boolean = false;
  taskKey: string = 'TASK-';
  labels: string[] = [];
  
  // View State
  currentView: 'board' | 'form' = 'board';

  constructor(
    private fb: FormBuilder,
    private apiservice: ApiService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.queryParamMap.get('projectId');
    this.loadTasks();
    this.initializeForm();
  }

  // === BOARD FUNCTIONALITY ===
  loadTasks(): void {
    this.apiservice.getalltaskofProject(this.projectId).subscribe(
      (response: any) => {
        // Assuming your API returns tasks in response.data or directly as array
        const tasks: Task[] = response.data || response || [];
        this.todo = tasks.filter(task => task.status === 'TO DO');
        this.inProgress = tasks.filter(task => task.status === 'IN PROGRESS');
        this.done = tasks.filter(task => task.status === 'DONE');
      },
      error => {
        this.toastr.error('Failed to load tasks');
      }
    );
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      
      // Update task status
      const task = event.container.data[event.currentIndex];
      const newStatus = this.getStatusFromContainerId(event.container.id);
      this.updateTaskStatus(task.id, newStatus);
    }
  }

  getStatusFromContainerId(containerId: string): string {
    switch (containerId) {
      case 'todoList': return 'TO DO';
      case 'inProgressList': return 'IN PROGRESS';
      case 'doneList': return 'DONE';
      default: return 'TO DO';
    }
  }

  updateTaskStatus(taskId: number, status: string): void {
    const updateData = {
      id: taskId,
      status: status
    };
    
    // Using your existing update method - note the URL might need adjustment
    this.apiservice.updateprojecttask(updateData).subscribe(
      response => {
        this.toastr.success('Task status updated');
      },
      error => {
        this.toastr.error('Failed to update task status');
        this.loadTasks(); // Reload to revert visual state
      }
    );
  }

  // === FORM FUNCTIONALITY ===
  initializeForm(): void {
    this.projectForm = this.fb.group({
      project_id: [this.projectId || '', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      assignee: [''],
      due_date: [''],
      priority: ['MEDIUM'],
      status: ['TO DO'],
      description: [''],
      comments: this.fb.array([])
    });
  }

  get comments(): FormArray {
    return this.projectForm.get('comments') as FormArray;
  }

  addComment(commentText: string): void {
    if (commentText.trim()) {
      this.comments.push(this.fb.control(commentText));
    }
  }

  removeComment(index: number): void {
    this.comments.removeAt(index);
  }

  addLabel(labelText: string): void {
    if (labelText.trim() && !this.labels.includes(labelText)) {
      this.labels.push(labelText.trim());
    }
  }

  removeLabel(label: string): void {
    this.labels = this.labels.filter(l => l !== label);
  }

  // === VIEW MANAGEMENT ===
  showCreateForm(): void {
    this.currentView = 'form';
    this.isUpdate = false;
    this.initializeForm();
    this.taskKey = `PROJ-${this.projectId}-NEW`;
  }

  showEditForm(task: Task): void {
    this.currentView = 'form';
    this.isUpdate = true;
    this.taskId = task.id;
    this.taskKey = `TASK-${task.id}`;
    this.bindTaskDetails(task);
  }

  showBoard(): void {
    this.currentView = 'board';
    this.loadTasks();
  }

  // === CRUD OPERATIONS ===
  submit(): void {
    if (this.projectForm.valid) {
      const reqobject = {
        ...this.projectForm.value,
        labels: this.labels
      };

      this.apiservice.addprojecttask(reqobject).subscribe(
        rs => {
          this.toastr.success('Task Added Successfully');
          this.showBoard();
        },
        error => {
          this.toastr.error('Failed to add task');
        }
      );
    } else {
      this.toastr.warning('Please fill all required fields');
    }
  }

  UpdateTask(): void {
    if (this.projectForm.valid) {
      const reqobject = {
        ...this.projectForm.value,
        id: this.taskId,
        labels: this.labels
      };

      this.apiservice.updateprojecttask(reqobject).subscribe(
        rs => {
          this.toastr.success('Task Updated Successfully');
          this.showBoard();
        },
        error => {
          this.toastr.error('Failed to update task');
        }
      );
    } else {
      this.toastr.warning('Please fill all required fields');
    }
  }

  deleteTask(taskId: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.apiservice.deleteTaskbyId(taskId).subscribe(
        rs => {
          this.toastr.success('Task Deleted Successfully');
          this.loadTasks();
        },
        error => {
          this.toastr.error('Failed to delete task');
        }
      );
    }
  }

  // === HELPER METHODS ===
  bindTaskDetails(data: Task): void {
    this.projectForm.patchValue({
      project_id: data.project_id,
      name: data.name,
      assignee: data.assignee,
      due_date: data.due_date,
      priority: data.priority,
      status: data.status,
      description: data.description || ''
    });

    // Bind comments
    if (data.comments && data.comments.length > 0) {
      this.comments.clear();
      data.comments.forEach((comment: string) => {
        this.addComment(comment);
      });
    }

    // Bind labels
    if (data.labels) {
      this.labels = data.labels;
    }
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'TO DO':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
      case 'IN PROGRESS':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'DONE':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'HIGH': return 'priority-high';
      case 'MEDIUM': return 'priority-medium';
      case 'LOW': return 'priority-low';
      default: return 'priority-medium';
    }
  }

  goBack(): void {
    this.router.navigate(['/project-details', this.projectId]);
  }

  // Method to get individual task details if needed
  getTaskDetails(id: any): void {
    this.apiservice.getTaskDetails(id).subscribe(
      res => {
        this.taskData = res;
        this.bindTaskDetails(this.taskData);
      }, 
      error => {
        this.toastr.error("Failed to load task details");
      }
    );
  }
}