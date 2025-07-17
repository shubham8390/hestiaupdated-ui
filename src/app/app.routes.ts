import { Routes } from '@angular/router';

export const routes: Routes = [
  
    {
      path: '',
      loadComponent: () => import('./components/core/chat-ui/chat-ui.component').then(m => m.ChatUIComponent),
    },
 
    {
      path: 'manage-projects',
      loadComponent: () => import('./components/core/manage-projects/manage-projects.component').then(m => m.ManageProjectsComponent),
    },

    {
      path: 'customers',
      loadComponent: () => import('./components/core/customers/customers.component').then(m => m.CustomersComponent),
    },
    
      
];
