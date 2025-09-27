import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavigationSidebarComponent } from '../../shared/navigation-sidebar/navigation-sidebar.component';
import { PropertyListingComponent } from '../property-listing/property-listing.component';
import { SaveHistoryComponent } from '../save-history/save-history.component';
import { ApiService } from '../Services/api.service';

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

  customers: Customer[] = [];

  filteredCustomers:any;
  selectedStatus: string = 'all';
  searchQuery: string = '';

  constructor(private router: Router, private apiservice: ApiService) { }

  ngOnInit() {
    debugger
    this.getallCustomeres();
    // this.filteredCustomers = [...this.customers];
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
    this.router.navigate(['/chat']);
  }

  onClearCurrentChat() {
    // Navigate to chat UI to clear current chat
    this.router.navigate(['/chat']);
  }

  onNewChat() {
    this.router.navigate(['/chat']);
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
    switch (status) {
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
    this.router.navigate(['/chat']);
  }

  getallCustomeres() {
    debugger
    this.apiservice.getCustomers().subscribe(res => {
      this.filteredCustomers = res.customers;
      this.customers = res.customers;
      console.log(this.filteredCustomers);

    }, error => {

    })
  }
}
