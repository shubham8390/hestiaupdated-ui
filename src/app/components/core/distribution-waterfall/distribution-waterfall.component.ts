import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../Services/api.service';
import { ToastrService } from 'ngx-toastr';

interface Stakeholder {
  name: string;
  type: string;
  percentage: number;
}

interface PieSlice {
  percentage: number;
  color: string;
  path: string;
}

@Component({
  selector: 'app-distribution-waterfall',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './distribution-waterfall.component.html',
  styleUrls: ['./distribution-waterfall.component.css']
})
export class DistributionWaterfallComponent implements OnInit {
  stakeholders: Stakeholder[] = [
    {
      name: "Metro Bank & Trust",
      type: "Bank",
      percentage: 60
    }
  ];


  

  pieSlices: PieSlice[] = [];
  private colors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // violet
    '#06B6D4', // cyan
    '#84CC16', // lime
    '#F97316'  // orange
  ];


  constructor( private fb: FormBuilder,
      private router: Router,
      private apiservice: ApiService,
      private route: ActivatedRoute,
      private toastr: ToastrService) {
   
  }
  ngOnInit() {
    this.getStakeHolderData();
    setTimeout(() => {
       this.generatePieSlices();
    }, 100);
   
  }

projectData:any
  getStakeHolderData(){
    let id=  localStorage.getItem("projectId");
     let name=  localStorage.getItem("projectname");
    this.apiservice.getstakeholderdata(name,id).subscribe(res=>{
      this.projectData=res;
      this.stakeholders=[]
      this.stakeholders=this.projectData.stakeholders
    })
  }

  private generatePieSlices() {
    debugger
    let currentAngle = 0;
    const radius = 16;
    const centerX = 21;
    const centerY = 21;

    this.pieSlices = this.stakeholders.map((stakeholder, index) => {
      const angle = (stakeholder.percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      const start = this.polarToCartesian(centerX, centerY, radius, startAngle);
      const end = this.polarToCartesian(centerX, centerY, radius, endAngle);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      const path = [
        'M', centerX, centerY,
        'L', start.x, start.y,
        'A', radius, radius, 0, largeArcFlag, 1, end.x, end.y,
        'Z'
      ].join(' ');

      const slice: PieSlice = {
        percentage: stakeholder.percentage,
        color: this.getStakeholderColor(index),
        path: path
      };
      
      currentAngle = endAngle;
      return slice;
    });
  }

  private polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  getStakeholderColor(index: number): string {
    return this.colors[index % this.colors.length];
  }

  getTotalPercentage(): number {
    return this.stakeholders.reduce((total, stakeholder) => total + stakeholder.percentage, 0);
  }

  highlightSlice(index: number) {
    // Add highlight effect
    this.pieSlices = this.pieSlices.map((slice, i) => ({
      ...slice,
      color: i === index ? this.darkenColor(this.getStakeholderColor(i), 20) : this.getStakeholderColor(i)
    }));
  }

  resetHighlight() {
    this.pieSlices = this.pieSlices.map((slice, i) => ({
      ...slice,
      color: this.getStakeholderColor(i)
    }));
  }

  private darkenColor(color: string, percent: number): string {
    // Simple color darkening for highlight effect
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }
}