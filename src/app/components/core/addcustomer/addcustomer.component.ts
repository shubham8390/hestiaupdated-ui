import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../Services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addcustomer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addcustomer.component.html',
  styleUrl: './addcustomer.component.css'
})
export class AddcustomerComponent implements OnInit {

  constructor(private fb: FormBuilder, private apiservice: ApiService, private route: ActivatedRoute, private toastr: ToastrService, private router: Router) { }
  ngOnInit(): void {
    this.forminitilization();

  }

  customerForm !: FormGroup


  forminitilization() {
    this.customerForm = this.fb.group({
      customer_name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      channel: ['Direct'],
      projects_units: this.fb.array([
        this.fb.group({
          project_name: ['', Validators.required],
          unit_name: ['', Validators.required],
          carpet_area: [0, Validators.required],
          total_price: [0, Validators.required],
          token_amount: [0, Validators.required]
        })
      ])
    });
  }


  onSubmit(): void {
    if (this.customerForm.valid) {
      const payload = this.customerForm.value;
      this.apiservice.addCustomer(payload).subscribe(res => {
        console.log(res);
        if (res.message.includes('Customer saved successfully')) {
          this.toastr.success('Customer saved successfully')
          debugger
          this.router.navigate(['/manage-projects']);
          // this.projectUnits=;
        }
        else {
          this.toastr.error('Something Wrong')
        }

      }, error => {
      });

      console.log('Payload:', payload);
      // TODO: Send payload to backend
    } else {
      console.log('Form Invalid');
    }
  }
  addProjectUnit(): void {
    this.projectUnits.push(this.createProjectUnit());
  }
  createProjectUnit(): FormGroup {
    return this.fb.group({
      project_name: ['', Validators.required],
      unit_name: ['', Validators.required],
      carpet_area: ['', Validators.required],
      total_price: ['', Validators.required],
      token_amount: ['', Validators.required],
    });
  }
  get projectUnits(): FormArray {
    return this.customerForm.get('projects_units') as FormArray;
  }


}
