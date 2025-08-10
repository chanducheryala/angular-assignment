import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, InjectionToken, importProvidersFrom } from '@angular/core';
import { provideRouter, withDebugTracing, withRouterConfig } from '@angular/router';
import { UpgradeModule } from '@angular/upgrade/static';

declare const angular: any;

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const NG1_INJECTOR = new InjectionToken<any>('NG1_INJECTOR');
export const NG1_STATE = new InjectionToken<any>('NG1_STATE');
export const NG1_TIMEOUT = new InjectionToken<any>('NG1_TIMEOUT');

function getAngularJSProviders() {
  try {
    if (typeof window !== 'undefined' && window.angular && angular.element(document).injector()) {
      const injector = angular.element(document).injector();
      
      const safeGet = (serviceName: string) => {
        try {
          return injector.get(serviceName);
        } catch (e) {
          console.warn(`Could not get AngularJS service: ${serviceName}`, e);
          return null;
        }
      };

      return [
        { provide: NG1_INJECTOR, useValue: injector },
        { 
          provide: NG1_STATE, 
          useFactory: () => safeGet('$state'),
          deps: [NG1_INJECTOR] 
        },
        { 
          provide: NG1_TIMEOUT, 
          useFactory: () => safeGet('$timeout'),
          deps: [NG1_INJECTOR] 
        },
        { provide: '$injector', useValue: injector },
        { 
          provide: '$state', 
          useFactory: () => safeGet('$state'),
          deps: ['$injector'] 
        },
        { 
          provide: '$timeout', 
          useFactory: () => safeGet('$timeout'),
          deps: ['$injector'] 
        },
      ];
    }
  } catch (e) {
    console.warn('Error initializing AngularJS providers', e);
  }
  return [];
}

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(UpgradeModule),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),
    provideRouter(
      routes,
      withDebugTracing(),
      withRouterConfig({
        onSameUrlNavigation: 'reload',
        paramsInheritanceStrategy: 'always',
        urlUpdateStrategy: 'eager',
        canceledNavigationResolution: 'computed'
      })
    ),
    ...getAngularJSProviders()
  ]
};
