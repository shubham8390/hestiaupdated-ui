import { Routes } from '@angular/router';
import { authGuard } from './components/core/Services/auth.guard'; // Adjust the path

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'signIn',
    pathMatch: 'full'
  },

  {
    path: 'chat',
    loadComponent: () => import('./components/core/chat-ui/chat-ui.component').then(m => m.ChatUIComponent),
   // canActivate: [authGuard],
  },

  {
    path: 'customerchat',
    loadComponent: () => import('./components/core/customer-chat-ui/customer-chat-ui.component').then(m => m.CustomerChatUiComponent),
   // canActivate: [authGuard],
  },

  {
    path: 'manage-projects',
    loadComponent: () => import('./components/core/manage-projects/manage-projects.component').then(m => m.ManageProjectsComponent),
  //  canActivate: [authGuard],
  },

  {
    path: 'add-project',
    loadComponent: () => import('./components/core/add-project/add-project.component').then(m => m.AddProjectComponent),
    //canActivate: [authGuard],
  },

  {
    path: 'project-details/:id',
    loadComponent: () => import('./components/core/project-details/project-details.component').then(m => m.ProjectDetailsComponent),
   // canActivate: [authGuard],
  },

  {
    path: 'customers',
    loadComponent: () => import('./components/core/customers/customers.component').then(m => m.CustomersComponent),
   // canActivate: [authGuard],
  },

  {
    path: 'createtask',
    loadComponent: () => import('./components/core/project-task/project-task.component').then(m => m.ProjectTaskComponent),
  //  canActivate: [authGuard],
  },

  {
    path: 'updatetask',
    loadComponent: () => import('./components/core/project-task/project-task.component').then(m => m.ProjectTaskComponent),
  //  canActivate: [authGuard],
  },

  {
    path: 'signIn',
    loadComponent: () => import('./components/core/authentication/authentication.component').then(m => m.AuthenticationComponent),
  },

  {
    path: 'callback',
    loadComponent: () => import('./components/core/callback/callback.component').then(m => m.CallbackComponent),
  },

  {
    path: 'addCustomer',
    loadComponent: () => import('./components/core/addcustomer/addcustomer.component').then(m => m.AddcustomerComponent),
   // canActivate: [authGuard],
  },

  {
    path: 'emicalculator',
    loadComponent: () => import('./components/core/emicalculator/emicalculator.component').then(m => m.EmicalculatorComponent),
   // canActivate: [authGuard],
  },
  {
    path: 'loading',
    loadComponent: () => import('./components/core/loading/loading.component').then(m => m.LoadingComponent),
   
  },
  {
    path: 'distribution',
    loadComponent: () => import('./components/core/distribution-waterfall/distribution-waterfall.component').then(m => m.DistributionWaterfallComponent),
   
  },
   {
    path: 'showtemplate/:id',
    loadComponent: () => import('./components/core/flyer-template-component/flyer-template-component.component').then(m => m.FlyerTemplateComponentComponent),
   
  }
];
