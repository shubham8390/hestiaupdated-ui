import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../Services/api.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-project-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-task.component.html',
  styleUrl: './project-task.component.css'
})

export class ProjectTaskComponent implements OnInit {



  projectForm !: FormGroup;
  projectId: any
  taskId: any
  taskData: any
  isUpdate: any = false;
  constructor(private fb: FormBuilder, private apiservice: ApiService, private route: ActivatedRoute, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    const currentUrl = this.router.url;
    if (currentUrl.includes('updatetask')) {
      const taskId = this.route.snapshot.queryParamMap.get('taskId');
      if (taskId) {
        this.taskId = taskId
        this.getTaskDetails(this.taskId);
        this.isUpdate = true
      }
    } else {
      const projectId = this.route.snapshot.queryParamMap.get('projectId');
      if (projectId) {
        this.projectId = projectId;
      }
    }



    this.projectForm = this.fb.group({
      project_id: [this.projectId || ''],
      name: [''],
      assignee: [''],
      due_date: [''],
      priority: [''],
      status: [''],
      comments: this.fb.array([]) // Empty array, can be added dynamically
    });
  }


  submit() {
    // let reqobject = {
    //   "project_id": "68923871445c62ac3a74f59f",
    //   "name": "",
    //   "assignee": "",
    //   "due_date": "",
    //   "priority": "",
    //   "status": "",
    //   "comments": []
    // }

    let reqobject = this.projectForm.value;

    this.apiservice.addprojecttask(reqobject).subscribe(
      rs => {
        this.toastr.success("Task Added SuccessFully");
          this.projectForm.reset();

      }
    );
  }

  get comments(): FormArray {
    return this.projectForm.get('comments') as FormArray;
  
  }

  addComment(commentText: string): void {
    this.comments.push(this.fb.control(commentText));
  }

  removeComment(num: any) {

  }

  getTaskDetails(id: any) {
    this.apiservice.getTaskDetails(id).subscribe(res => {
      this.taskData = res;
      this.bindTaskDetails(this.taskData);
    }, error => {

    })
  }


  bindTaskDetails(data: any) {
    this.projectId = data.project_id
    this.projectForm.patchValue({
      project_id: data.project_id,
      name: data.name,
      assignee: data.assignee,
      due_date: data.due_date,
      priority: data.priority,
      status: data.status
    });

  }

  UpdateTask() {
    let reqobject = {
      ...this.projectForm.value,
      id: this.taskId
    };


    this.apiservice.updateprojecttask(reqobject).subscribe(
      rs => {
        this.toastr.success("Task updated SuccessFully");
        this.router.navigate(['/project-details', this.projectId]);
      }
    );
  }

goBack(){
     this.router.navigate(['/project-details', this.projectId]);
}


}
