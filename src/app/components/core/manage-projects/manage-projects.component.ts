import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-projects.component.html',
  styleUrl: './manage-projects.component.css'
})
export class ManageProjectsComponent {
  
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/']);
  }
}
