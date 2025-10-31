// src/app/core/interceptors/auth.interceptor.ts

import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    
    // Check if the request URL matches specific criteria
    if (req.url.includes('/auth/login') || req.url.includes('/auth/callback')  ) {
        // If the URL doesn't match the criteria, pass the request unchanged
        return next(req);
    }

    // Retrieve the token from sessionStorage
    const token = localStorage?.getItem('jwt');

    if (token) {
        // Clone the request and set the Authorization header with the Bearer token
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`, // Correctly format the Bearer token
            },
        });
        return next(authReq); // Pass the cloned request with the Authorization header
    }

    // If no token is available, pass the original request
    return next(req);
};
