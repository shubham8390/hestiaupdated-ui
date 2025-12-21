import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../Services/api.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-project-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-task.component.html',
  styleUrls: ['./project-task.component.css']
})
export class ProjectTaskComponent implements OnInit {
  projectForm!: FormGroup;
  projectId: any;
  taskId: any;
  taskData: any;
  isUpdate: any = false;

  constructor(
    private fb: FormBuilder, 
    private apiservice: ApiService, 
    private route: ActivatedRoute, 
    private toastr: ToastrService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    const currentUrl = this.router.url;
    
    if (currentUrl.includes('updatetask')) {
      const taskId = this.route.snapshot.queryParamMap.get('taskId');
      if (taskId) {
        this.taskId = taskId;
        this.getTaskDetails(this.taskId);
        this.isUpdate = true;
      }
    } else {
      const projectId = this.route.snapshot.queryParamMap.get('projectId');
      if (projectId) {
        this.projectId = projectId;
      }
    }

    this.initializeForm();
  }

  initializeForm(): void {
    this.projectForm = this.fb.group({
      project_id: [this.projectId || '', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      assignee: [''],
      due_date: [''],
      priority: ['MEDIUM'],
      status: ['TO DO'],
      comments: this.fb.array([])
    });
  }

  submit(): void {
    if (this.projectForm.valid) {
      const reqobject = this.projectForm.value;

      this.apiservice.addprojecttask(reqobject).subscribe(
        rs => {
          this.toastr.success("Task Added Successfully");
          this.projectForm.reset();
          this.goBack();
        },
        error => {
          this.toastr.error("Failed to add task");
        }
      );
    } else {
      this.toastr.warning("Please fill all required fields");
    }
  }

  get comments(): FormArray {
    return this.projectForm.get('comments') as FormArray;
  }

  addComment(commentText: string): void {
    this.comments.push(this.fb.control(commentText));
  }

  removeComment(index: number): void {
    this.comments.removeAt(index);
  }

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

  bindTaskDetails(data: any): void {
    this.projectId = data.project_id;
    this.projectForm.patchValue({
      project_id: data.project_id,
      name: data.name,
      assignee: data.assignee,
      due_date: data.due_date,
      priority: data.priority,
      status: data.status
    });

    // Bind comments if they exist
    if (data.comments && data.comments.length > 0) {
      this.comments.clear();
      data.comments.forEach((comment: string) => {
        this.addComment(comment);
      });
    }
  }

  UpdateTask(): void {
    if (this.projectForm.valid) {
      const reqobject = {
        ...this.projectForm.value,
        id: this.taskId
      };

      this.apiservice.updateprojecttask(reqobject).subscribe(
        rs => {
          this.toastr.success("Task Updated Successfully");
          this.router.navigate(['/project-details', this.projectId]);
        },
        error => {
          this.toastr.error("Failed to update task");
        }
      );
    } else {
      this.toastr.warning("Please fill all required fields");
    }
  }

  goBack(): void {
    this.router.navigate(['/project-details', this.projectId]);
  }
}