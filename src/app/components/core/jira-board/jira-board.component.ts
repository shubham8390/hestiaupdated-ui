// jira-board.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

// Define interfaces
interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
  role: string;
}

interface TaskAssignee {
  name: string;
  email: string;
  picture: string;
}

interface Subtask {
  _id: string;
  name: string;
  status: number;
  due_date: string;
  priority?: number;
  assignee_id?: string;
  assignee?: TaskAssignee;
}

interface Task {
  _id: string;
  project_id: string;
  name: string;
  description: string;
  assignee_id: string;
  assignee: TaskAssignee;
  start_date: string;
  due_date: string;
  priority: number;
  status: number;
  subtasks: Subtask[];
  tags: string[];
}

interface StatusColumn {
  id: string;
  name: string;
  color: string;
  tasks: Task[];
}

@Component({
  selector: 'app-jira-board',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule
  ],
  templateUrl: './jira-board.component.html',
  styleUrls: ['./jira-board.component.css']
})
export class JiraBoardComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  // Status columns with proper typing
  statusColumns: StatusColumn[] = [
    { id: 'todo', name: 'To Do', color: 'bg-blue-500', tasks: [] },
    { id: 'in-progress', name: 'In Progress', color: 'bg-yellow-500', tasks: [] },
    { id: 'review', name: 'Review', color: 'bg-purple-500', tasks: [] },
    { id: 'done', name: 'Done', color: 'bg-green-500', tasks: [] }
  ];

  // Dummy users data
  users: User[] = [
    {
      id: 'user1',
      name: 'John Doe',
      email: 'john@example.com',
      picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop',
      role: 'Frontend Developer'
    },
    {
      id: 'user2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      picture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop',
      role: 'Backend Developer'
    },
    {
      id: 'user3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop',
      role: 'DevOps Engineer'
    },
    {
      id: 'user4',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      picture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop',
      role: 'QA Engineer'
    },
    {
      id: 'user5',
      name: 'Alex Chen',
      email: 'alex@example.com',
      picture: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=40&h=40&fit=crop',
      role: 'UI/UX Designer'
    },
    {
      id: 'user6',
      name: 'Emily Brown',
      email: 'emily@example.com',
      picture: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop',
      role: 'Project Manager'
    },
    {
      id: 'user7',
      name: 'David Lee',
      email: 'david@example.com',
      picture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop',
      role: 'Full Stack Developer'
    },
    {
      id: 'user8',
      name: 'Lisa Taylor',
      email: 'lisa@example.com',
      picture: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=40&h=40&fit=crop',
      role: 'Mobile Developer'
    }
  ];

  // Tasks data
  tasks: Task[] = [];
  
  // Selected items
  selectedTask: Task | null = null;
  selectedSubtask: Subtask | null = null;
  
  // Forms
  taskForm!: FormGroup;
  subtaskForm!: FormGroup;
  
  // Modal states
  isTaskModalOpen = false;
  isSubtaskModalOpen = false;
  isDeleteModalOpen = false;
  isSubtaskDeleteModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  
  // Loading states
  isLoading = false;
  searchTerm: string = '';

  // Dummy data with proper typing
  dummyTasks: Task[] = [
    {
      _id: '1',
      project_id: '69215e0f2e00995abecedd82',
      name: 'Design Homepage',
      description: 'Create homepage design with modern UI elements',
      assignee_id: 'user5',
      assignee: {
        name: 'Alex Chen',
        email: 'alex@example.com',
        picture: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=40&h=40&fit=crop'
      },
      start_date: '2024-01-15',
      due_date: '2024-01-25',
      priority: 2,
      status: 0,
      subtasks: [
        { _id: 'sub1', name: 'Create wireframes', status: 1, due_date: '2024-01-18' },
        { _id: 'sub2', name: 'Design color scheme', status: 0, due_date: '2024-01-20' }
      ],
      tags: ['UI/UX', 'Design']
    },
    {
      _id: '2',
      project_id: '69215e0f2e00995abecedd82',
      name: 'API Integration',
      description: 'Integrate backend APIs with frontend',
      assignee_id: 'user2',
      assignee: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        picture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop'
      },
      start_date: '2024-01-10',
      due_date: '2024-01-30',
      priority: 1,
      status: 1,
      subtasks: [],
      tags: ['Backend', 'API']
    },
    {
      _id: '3',
      project_id: '69215e0f2e00995abecedd82',
      name: 'Database Optimization',
      description: 'Optimize database queries and indexing',
      assignee_id: 'user3',
      assignee: {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop'
      },
      start_date: '2024-01-20',
      due_date: '2024-02-05',
      priority: 0,
      status: 2,
      subtasks: [
        { _id: 'sub3', name: 'Analyze query performance', status: 0, due_date: '2024-01-25' }
      ],
      tags: ['Database', 'Performance']
    },
    {
      _id: '4',
      project_id: '69215e0f2e00995abecedd82',
      name: 'Mobile App Testing',
      description: 'Test mobile application on different devices',
      assignee_id: 'user4',
      assignee: {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        picture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop'
      },
      start_date: '2024-01-25',
      due_date: '2024-02-10',
      priority: 1,
      status: 3,
      subtasks: [
        { _id: 'sub4', name: 'iOS testing', status: 1, due_date: '2024-01-30' },
        { _id: 'sub5', name: 'Android testing', status: 1, due_date: '2024-01-30' }
      ],
      tags: ['Testing', 'Mobile']
    }
  ];

  // Priority options
  priorityOptions = [
    { value: 0, label: 'Low', color: 'bg-green-500/20 text-green-400' },
    { value: 1, label: 'Medium', color: 'bg-yellow-500/20 text-yellow-400' },
    { value: 2, label: 'High', color: 'bg-red-500/20 text-red-400' }
  ];

  ngOnInit() {
    this.initializeForms();
    this.loadTasks();
  }

  initializeForms() {
    this.taskForm = this.fb.group({
      project_id: ['69215e0f2e00995abecedd82', Validators.required],
      name: ['', Validators.required],
      description: [''],
      assignee_id: [''],
      assignee: this.fb.group({
        name: [''],
        email: [''],
        picture: ['']
      }),
      start_date: [''],
      due_date: [''],
      priority: [0],
      status: [0]
    });

    this.subtaskForm = this.fb.group({
      name: ['', Validators.required],
      assignee_id: [''],
      assignee: this.fb.group({
        name: [''],
        email: [''],
        picture: ['']
      }),
      due_date: [''],
      priority: [0],
      status: [0]
    });
  }

  loadTasks() {
    this.isLoading = true;
    
    // Simulate API call with dummy data
    setTimeout(() => {
      this.tasks = [...this.dummyTasks];
      this.distributeTasksToColumns();
      this.isLoading = false;
    }, 1000);
  }

  distributeTasksToColumns() {
    // Clear existing tasks in columns
    this.statusColumns.forEach(col => col.tasks = []);
    
    // Distribute tasks to appropriate columns
    this.tasks.forEach(task => {
      const column = this.statusColumns[task.status];
      if (column) {
        column.tasks.push(task);
      }
    });
  }

  // FIXED: Updated the drop method signature
  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      // Update task status based on column
      const task = event.container.data[event.currentIndex];
      const newColumnIndex = this.statusColumns.findIndex(col => col.id === event.container.id);
      if (newColumnIndex !== -1) {
        task.status = newColumnIndex;
        this.updateTaskStatus(task._id, newColumnIndex);
      }
    }
  }

  updateTaskStatus(taskId: string, status: number) {
    console.log('Updating task status:', taskId, status);
    // API call would go here
  }

  // Filter tasks based on search term
  filterTasks() {
    if (!this.searchTerm) {
      return this.tasks;
    }
    
    const searchTerm = this.searchTerm.toLowerCase();
    return this.tasks.filter(task => 
      task.name.toLowerCase().includes(searchTerm) ||
      task.description.toLowerCase().includes(searchTerm) ||
      task.assignee?.name.toLowerCase().includes(searchTerm) ||
      (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );
  }

  // Task CRUD Operations
  openTaskModal(mode: 'create' | 'edit', task?: Task) {
    this.modalMode = mode;
    this.isTaskModalOpen = true;
    
    if (mode === 'edit' && task) {
      this.selectedTask = task;
      this.taskForm.patchValue({
        ...task,
        start_date: this.formatDateForInput(task.start_date),
        due_date: this.formatDateForInput(task.due_date)
      });
    } else {
      this.selectedTask = null;
      this.taskForm.reset({
        project_id: '69215e0f2e00995abecedd82',
        priority: 0,
        status: 0,
        assignee_id: ''
      });
    }
  }

  closeTaskModal() {
    this.isTaskModalOpen = false;
    this.taskForm.reset();
    this.selectedTask = null;
  }

  saveTask() {
    if (this.taskForm.invalid) return;

    const formData = this.taskForm.value;
    const selectedUser = this.getSelectedUser(formData.assignee_id);
    
    const taskData = {
      ...formData,
      assignee: selectedUser ? {
        name: selectedUser.name,
        email: selectedUser.email,
        picture: selectedUser.picture
      } : undefined
    };
    
    if (this.modalMode === 'create') {
      // Simulate API call
      const newTask: Task = {
        _id: (this.tasks.length + 1).toString(),
        ...taskData,
        assignee_id: formData.assignee_id,
        subtasks: [],
        tags: []
      };
      this.tasks.push(newTask);
      this.distributeTasksToColumns();
      this.closeTaskModal();
    } else {
      // Simulate API call
      const index = this.tasks.findIndex(t => t._id === this.selectedTask?._id);
      if (index !== -1 && this.selectedTask) {
        this.tasks[index] = { 
          ...this.tasks[index], 
          ...taskData,
          assignee_id: formData.assignee_id
        };
        this.distributeTasksToColumns();
      }
      this.closeTaskModal();
    }
  }

  confirmDeleteTask(task: Task) {
    this.selectedTask = task;
    this.isDeleteModalOpen = true;
  }

  deleteTask() {
    // Simulate API call
    this.tasks = this.tasks.filter(t => t._id !== this.selectedTask?._id);
    this.distributeTasksToColumns();
    this.isDeleteModalOpen = false;
    this.selectedTask = null;
  }

  // Subtask CRUD Operations
  openSubtaskModal(mode: 'create' | 'edit', task: Task, subtask?: Subtask) {
    this.selectedTask = task;
    this.selectedSubtask = subtask || null;
    this.modalMode = mode;
    this.isSubtaskModalOpen = true;
    
    if (mode === 'edit' && subtask) {
      this.subtaskForm.patchValue({
        ...subtask,
        assignee_id: subtask.assignee_id || '',
        due_date: this.formatDateForInput(subtask.due_date)
      });
    } else {
      this.subtaskForm.reset({
        priority: 0,
        status: 0,
        assignee_id: ''
      });
    }
  }

  closeSubtaskModal() {
    this.isSubtaskModalOpen = false;
    this.subtaskForm.reset();
    this.selectedSubtask = null;
  }

  saveSubtask() {
    if (this.subtaskForm.invalid || !this.selectedTask) return;

    const formData = this.subtaskForm.value;
    const selectedUser = this.getSelectedUser(formData.assignee_id);
    
    const subtaskData = {
      ...formData,
      assignee: selectedUser ? {
        name: selectedUser.name,
        email: selectedUser.email,
        picture: selectedUser.picture
      } : undefined
    };
    
    if (this.modalMode === 'create') {
      // Simulate API call
      const newSubtask: Subtask = {
        _id: `sub${Date.now()}`,
        ...subtaskData
      };
      
      if (!this.selectedTask.subtasks) {
        this.selectedTask.subtasks = [];
      }
      this.selectedTask.subtasks.push(newSubtask);
      this.closeSubtaskModal();
    } else {
      // Simulate API call
      const index = this.selectedTask.subtasks.findIndex(s => s._id === this.selectedSubtask?._id);
      if (index !== -1 && this.selectedSubtask) {
        this.selectedTask.subtasks[index] = { 
          ...this.selectedTask.subtasks[index], 
          ...subtaskData 
        };
      }
      this.closeSubtaskModal();
    }
  }

  confirmDeleteSubtask(task: Task, subtask: Subtask) {
    this.selectedTask = task;
    this.selectedSubtask = subtask;
    this.isSubtaskDeleteModalOpen = true;
  }

  deleteSubtask() {
    // Simulate API call
    if (this.selectedTask && this.selectedSubtask) {
      this.selectedTask.subtasks = this.selectedTask.subtasks.filter(s => s._id !== this.selectedSubtask?._id);
    }
    this.isSubtaskDeleteModalOpen = false;
    this.selectedTask = null;
    this.selectedSubtask = null;
  }

  // Helper methods
  getSelectedUser(userId: string): User | undefined {
    return this.users.find(user => user.id === userId);
  }

  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      // Format as YYYY-MM-DD for input type="date"
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (e) {
      return '';
    }
  }

  getPriorityClass(priority: number): string {
    const option = this.priorityOptions.find(p => p.value === priority);
    return option ? option.color : 'bg-gray-100 text-gray-800';
  }

  getPriorityLabel(priority: number): string {
    const option = this.priorityOptions.find(p => p.value === priority);
    return option ? option.label : 'Unknown';
  }

  getSubtasksStatus(subtasks: Subtask[]): string {
    if (!subtasks || subtasks.length === 0) return 'No subtasks';
    const completed = subtasks.filter(s => s.status === 1).length;
    return `${completed}/${subtasks.length} completed`;
  }

  toggleSubtaskStatus(subtask: Subtask) {
    subtask.status = subtask.status === 1 ? 0 : 1;
  }

  getConnectedLists(): string[] {
    return this.statusColumns.map(col => col.id);
  }

  // Simple date formatter
  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
      return '';
    }
  }
}