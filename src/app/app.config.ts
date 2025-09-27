import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { authInterceptor } from './components/core/Services/auth.interceptor';


// export const appConfig: ApplicationConfig = {
//   providers: [provideRouter(routes),provideHttpClient(withFetch()),importProvidersFrom(MarkdownModule.forRoot()),  provideAnimations(),   
//     provideToastr()]
// };

export const appConfig: ApplicationConfig = {
 providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),  // If you prefer using Fetch API, you can keep it. Otherwise, you can remove it.
      withInterceptors([authInterceptor])  // Pass the class, not the function
    ),
    importProvidersFrom(MarkdownModule.forRoot()),
    provideAnimations(),
    provideToastr(),
  ],
};
