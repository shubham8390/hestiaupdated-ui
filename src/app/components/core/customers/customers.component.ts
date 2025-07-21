import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavigationSidebarComponent } from '../../shared/navigation-sidebar/navigation-sidebar.component';
import { PropertyListingComponent } from '../property-listing/property-listing.component';
import { SaveHistoryComponent } from '../save-history/save-history.component';

interface Customer {
  id: number;
  name: string;
  status: 'lead' | 'prospect' | 'buyer';
  email: string;
  phone: string;
  dateAdded: string;
}

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationSidebarComponent, PropertyListingComponent, SaveHistoryComponent],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {
  // Sidebar states
  isNavigationSidebarExpanded: boolean = true;
  isHistorySidebarOpen: boolean = false;
  isPropertiesSidebarOpen: boolean = false;
  isMobileView: boolean = false;
  
  customers: Customer[] = [
    {
      id: 1,
      name: 'John Smith',
      status: 'lead',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      dateAdded: '2024-01-15'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      status: 'prospect',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 234-5678',
      dateAdded: '2024-01-14'
    },
    {
      id: 3,
      name: 'Michael Brown',
      status: 'buyer',
      email: 'michael.brown@email.com',
      phone: '+1 (555) 345-6789',
      dateAdded: '2024-01-13'
    },
    {
      id: 4,
      name: 'Emily Davis',
      status: 'lead',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 456-7890',
      dateAdded: '2024-01-12'
    },
    {
      id: 5,
      name: 'David Wilson',
      status: 'prospect',
      email: 'david.wilson@email.com',
      phone: '+1 (555) 567-8901',
      dateAdded: '2024-01-11'
    },
    {
      id: 6,
      name: 'Jessica Miller',
      status: 'buyer',
      email: 'jessica.miller@email.com',
      phone: '+1 (555) 678-9012',
      dateAdded: '2024-01-10'
    },
    {
      id: 7,
      name: 'Robert Taylor',
      status: 'lead',
      email: 'robert.taylor@email.com',
      phone: '+1 (555) 789-0123',
      dateAdded: '2024-01-09'
    },
    {
      id: 8,
      name: 'Amanda Anderson',
      status: 'prospect',
      email: 'amanda.anderson@email.com',
      phone: '+1 (555) 890-1234',
      dateAdded: '2024-01-08'
    }
  ];

  filteredCustomers: Customer[] = [];
  selectedStatus: string = 'all';
  searchQuery: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.filteredCustomers = [...this.customers];
    this.checkMobileView();
    // Start collapsed on desktop for hover-to-expand experience
    if (!this.isMobileView) {
      this.isNavigationSidebarExpanded = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkMobileView();
  }

  private checkMobileView() {
    if (typeof window !== 'undefined') {
      this.isMobileView = window.innerWidth < 1024; // lg breakpoint
    }
  }

  toggleNavigationSidebar() {
    this.isNavigationSidebarExpanded = !this.isNavigationSidebarExpanded;
  }

  onClearChat() {
    // No chat functionality on this page
  }

  onToggleHistory() {
    this.isHistorySidebarOpen = !this.isHistorySidebarOpen;
  }

  onToggleProperties() {
    this.isPropertiesSidebarOpen = !this.isPropertiesSidebarOpen;
  }

  onLoadConversation(messages: any[]) {
    // Navigate to chat UI with loaded conversation
    this.router.navigate(['/']);
  }

  onClearCurrentChat() {
    // Navigate to chat UI to clear current chat
    this.router.navigate(['/']);
  }

  onNewChat() {
    this.router.navigate(['/']);
  }

  onStatusFilterChange() {
    this.applyFilters();
  }

  onSearchChange() {
    this.applyFilters();
  }

  private applyFilters() {
    this.filteredCustomers = this.customers.filter(customer => {
      const matchesStatus = this.selectedStatus === 'all' || customer.status === this.selectedStatus;
      const matchesSearch = customer.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                           customer.email.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'lead': return 'bg-yellow-600';
      case 'prospect': return 'bg-blue-600';
      case 'buyer': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  }

  getStatusCount(status: string): number {
    return this.customers.filter(customer => customer.status === status).length;
  }

  trackByCustomerId(index: number, customer: Customer): number {
    return customer.id;
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
