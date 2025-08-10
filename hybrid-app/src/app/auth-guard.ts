import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  
  // Only check localStorage in browser environment
  let isAuthenticated = false;
  if (isPlatformBrowser(platformId)) {
    isAuthenticated = localStorage.getItem('authToken') === 'dummy-token';
  }
  
  if (!isAuthenticated) {
    return router.createUrlTree(
      ['/login'], 
      { 
        queryParams: { 
          returnUrl: state.url === '/' ? undefined : state.url 
        } 
      }
    );
  }
  return true;
};
