import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

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
export class PropertyListingComponent {
  @Output() closeSidebar = new EventEmitter<void>();
  
  properties: Property[] = [
    {
      id: 1,
      title: 'Modern Downtown Apartment',
      price: '$850,000',
      location: 'Downtown, NYC',
      bedrooms: 2,
      bathrooms: 2,
      area: '1,200 sq ft',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
      type: 'Apartment',
      status: 'For Sale'
    },
    {
      id: 2,
      title: 'Luxury Villa with Pool',
      price: '$2,500/month',
      location: 'Beverly Hills, CA',
      bedrooms: 4,
      bathrooms: 3,
      area: '2,800 sq ft',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop',
      type: 'Villa',
      status: 'For Rent'
    },
    {
      id: 3,
      title: 'Cozy Studio Near Campus',
      price: '$1,200/month',
      location: 'University District',
      bedrooms: 1,
      bathrooms: 1,
      area: '450 sq ft',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
      type: 'Studio',
      status: 'For Rent'
    },
    {
      id: 4,
      title: 'Suburban Family Home',
      price: '$675,000',
      location: 'Westfield, NJ',
      bedrooms: 3,
      bathrooms: 2,
      area: '1,800 sq ft',
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
      type: 'House',
      status: 'For Sale'
    },
    {
      id: 5,
      title: 'Penthouse with City View',
      price: '$1,200,000',
      location: 'Manhattan, NYC',
      bedrooms: 3,
      bathrooms: 2,
      area: '1,900 sq ft',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
      type: 'Penthouse',
      status: 'For Sale'
    }
  ];

  onCloseSidebar() {
    this.closeSidebar.emit();
  }

  onPropertyClick(property: Property) {
    console.log('Property clicked:', property);
    // Add logic to handle property selection
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
