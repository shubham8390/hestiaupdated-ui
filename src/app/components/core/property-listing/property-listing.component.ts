import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../Services/api.service';

interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  image: string;
  type: string;
  status: 'For Sale' | 'For Rent' | 'Sold';
}

@Component({
  selector: 'app-property-listing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-listing.component.html',
  styleUrl: './property-listing.component.css'
})
export class PropertyListingComponent implements OnInit {
  ngOnInit(): void {
   this.getPropertyList();
  }

  constructor(private apiserve:ApiService) {
 

  }
  @Output() closeSidebar = new EventEmitter<void>();
  @Output() expandSidebar = new EventEmitter<void>();
  
  properties: any

  onCloseSidebar() {
    this.closeSidebar.emit();
  }

  onExpandSidebar() {
    this.expandSidebar.emit();
  }

  onPropertyClick(property: Property) {
    console.log('Property clicked:', property);
    // Add logic to handle property selection
  }

  getPropertyList(){
    this.apiserve.getPropertyList().subscribe(res=>{
      this.properties=res;
    })
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'For Sale':
        return 'bg-green-100 text-green-800';
      case 'For Rent':
        return 'bg-blue-100 text-blue-800';
      case 'Sold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
