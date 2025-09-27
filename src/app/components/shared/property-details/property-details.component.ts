import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
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
  description?: string;
  amenities?: string[];
}

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.css'
})
export class PropertyDetailsComponent implements OnInit, OnDestroy {
  @Output() closeDetails = new EventEmitter<void>();

  properties: Property[] = [
    {
      id: 1,
      title: 'Modern Downtown Apartment',
      price: '₹7,08,50,000',
      location: 'Downtown, Mumbai',
      bedrooms: 2,
      bathrooms: 2,
      area: '1,200 sq ft',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
      type: 'Apartment',
      status: 'For Sale',
      description: 'Beautiful modern apartment with stunning city views, premium finishes, and excellent connectivity to business districts.',
      amenities: ['Swimming Pool', 'Gym', 'Parking', 'Security', 'Elevator']
    },
    {
      id: 2,
      title: 'Luxury Villa with Pool',
      price: '₹2,08,750/month',
      location: 'Bandra, Mumbai',
      bedrooms: 4,
      bathrooms: 3,
      area: '2,800 sq ft',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop',
      type: 'Villa',
      status: 'For Rent',
      description: 'Spacious luxury villa with private pool, garden, and premium amenities in a prime location.',
      amenities: ['Private Pool', 'Garden', 'Parking', 'Security', 'Club House']
    },
    {
      id: 3,
      title: 'Cozy Studio Near Campus',
      price: '₹1,00,200/month',
      location: 'Koramangala, Bangalore',
      bedrooms: 1,
      bathrooms: 1,
      area: '450 sq ft',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
      type: 'Studio',
      status: 'For Rent',
      description: 'Perfect studio apartment for students and young professionals, close to tech parks and universities.',
      amenities: ['Wi-Fi', 'Furnished', 'Parking', 'Security']
    },
    {
      id: 4,
      title: 'Suburban Family Home',
      price: '₹5,63,12,500',
      location: 'Gurgaon, Delhi NCR',
      bedrooms: 3,
      bathrooms: 2,
      area: '1,800 sq ft',
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
      type: 'House',
      status: 'For Sale',
      description: 'Comfortable family home in a peaceful suburban neighborhood with excellent schools nearby.',
      amenities: ['Garden', 'Parking', 'Security', 'School Nearby', 'Park View']
    },
    {
      id: 5,
      title: 'Penthouse with City View',
      price: '₹10,02,00,000',
      location: 'South Delhi, Delhi',
      bedrooms: 3,
      bathrooms: 2,
      area: '1,900 sq ft',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
      type: 'Penthouse',
      status: 'For Sale',
      description: 'Exclusive penthouse with panoramic city views, premium interiors, and world-class amenities.',
      amenities: ['City View', 'Terrace', 'Premium Interior', 'Concierge', 'Valet Parking']
    },
    {
      id: 6,
      title: 'Commercial Office Space',
      price: '₹4,50,000/month',
      location: 'BKC, Mumbai',
      bedrooms: 0,
      bathrooms: 4,
      area: '3,500 sq ft',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
      type: 'Office',
      status: 'For Rent',
      description: 'Prime commercial office space in Mumbai\'s financial district with modern infrastructure.',
      amenities: ['24/7 Access', 'Conference Rooms', 'Parking', 'Security', 'High-Speed Internet']
    }
  ];

  selectedProperty: Property | null = null;
  viewMode: 'grid' | 'list' = 'grid';

  ngOnInit() {
    // Disable body scroll when component is opened
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    // Re-enable body scroll when component is destroyed
    document.body.style.overflow = 'auto';
  }

  onCloseDetails() {
    // Re-enable body scroll before closing
    document.body.style.overflow = 'auto';
    this.closeDetails.emit();
  }

  onPropertyClick(property: Property) {
    this.selectedProperty = property;
  }

  onClosePropertyModal() {
    this.selectedProperty = null;
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
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