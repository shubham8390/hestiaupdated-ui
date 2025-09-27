import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NavigationSidebarComponent } from '../../shared/navigation-sidebar/navigation-sidebar.component';
import { PropertyListingComponent } from '../property-listing/property-listing.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../Services/api.service';
import { SaveHistoryComponent } from '../save-history/save-history.component';

interface _propertyUnits {
  unit_available: string;
  unit_price_high: string;
  unit_price_low: string
  unit_size: string
  unit_sold: string
  unit_total: string
  unit_type: string
}
@Component({
  selector: 'app-emicalculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,NavigationSidebarComponent, PropertyListingComponent, SaveHistoryComponent],
  templateUrl: './emicalculator.component.html',
  styleUrl: './emicalculator.component.css'
})

export class EmicalculatorComponent implements OnInit {

  loanForm!: FormGroup;
  emiDetails: any;
  selectedUnit: string = '';
  propertyUnits: _propertyUnits[] = [];
  // propertyUnits = [
  //   {
  //     name: '1 BHK',
  //     price: 2500000
  //   },
  //   {
  //     name: '2 BHK',
  //     price: 4500000
  //   },
  //   {
  //     name: '3 BHK',
  //     price: 7500000
  //   }
  // ];

  constructor(private router: Router, private fb: FormBuilder, private route: ActivatedRoute, private apiservice: ApiService,) { }



  ngOnInit(): void {
    debugger
    const editId = this.route.snapshot.queryParamMap.get('edit');
    if (editId) {
      this.getProjectDetails(editId);
    }

    this.loanForm = this.fb.group({
      totalPrice: [0, [Validators.required, Validators.min(0)]],
      downPayment: [0, [Validators.required, Validators.min(0)]],
      tenure: [0, [Validators.required, Validators.min(1)]], // in years
      interestRate: [0, [Validators.required, Validators.min(5)]],
    });
    this.calculateEMI();

  }

  goBack() {
    debugger
    this.router.navigate(['/manage-projects']);
  }
  getProjectDetails(projectId: any) {
    debugger
    this.apiservice.getProjectDetails(projectId).subscribe(res => {
      this.propertyUnits = res.units;
      console.log(this.propertyUnits);
    }, error => {

    })
  }

  calculateEMI(): void {
    const totalPrice = this.loanForm.value.totalPrice;
    const downPayment = this.loanForm.value.downPayment;
    const tenureYears = this.loanForm.value.tenure;
    const interestRate = this.loanForm.value.interestRate;

    const principal = totalPrice - downPayment;
    const tenureMonths = tenureYears * 12;
    const monthlyRate = interestRate / 12 / 100;

    const emi = monthlyRate === 0
      ? principal / tenureMonths
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1);

    const totalPayable = emi * tenureMonths;
    const totalInterest = totalPayable - principal;

    this.emiDetails = {
      monthlyEMI: emi.toFixed(2),
      principal: principal.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalPayable: totalPayable.toFixed(2),
    };
  }

  // onPropertySelect(selectedUnitName: string): void {
    onPropertySelect(event: any): void {
      const selectedUnitType = event.target.value;   // Get selected value from dropdown
      const selected = this.propertyUnits.find(u => u.unit_type === selectedUnitType);
    
      if (selected) {
        const price = parseFloat(selected.unit_price_low);
        this.loanForm.patchValue({
          totalPrice: price,
          downPayment: Math.round(price * 0.10),  // default 10% downpayment
          tenure: 1,
          interestRate: 5
        });
        this.calculateEMI();
      }
    }
    



  // setid(usnittype:any){
  //   debugger
  //   this.selectedUnit =  usnittype;
  //   this.onPropertySelect(this.selectedUnit);
  // }

}
