import { Routes } from '@angular/router';

export const routes: Routes = [
  
    {
      path: '',
      loadComponent: () => import('./components/core/chat-ui/chat-ui.component').then(m => m.ChatUIComponent),
    },
 
    
      
];
