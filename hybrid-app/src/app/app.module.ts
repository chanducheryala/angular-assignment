import { NgModule, Injector, ApplicationRef, DoBootstrap, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LoginNewComponent } from './auth/login-new/login-new.component';
import { Dashboard } from './dashboard/dashboard';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { CommonModule } from '@angular/common';
import { provideClientHydration } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { UpgradeModule, downgradeComponent, setAngularJSGlobal } from '@angular/upgrade/static';
import * as angular from 'angular';

export function initializeAngularJS(upgrade: UpgradeModule) {
  return () => {
    upgrade.bootstrap(document.body, ['hybridApp'], { strictDi: true });
  };
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    RouterModule.forRoot(routes, { enableTracing: false }),
    UpgradeModule,
    Dashboard,
    LoginNewComponent
  ],
  providers: [
    provideClientHydration(),
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAngularJS,
      deps: [UpgradeModule],
      multi: true
    }
  ]
})
export class AppModule implements DoBootstrap {
  constructor(private upgrade: UpgradeModule) {
    // Set AngularJS global
    setAngularJSGlobal(angular);
  }

  ngDoBootstrap(appRef: ApplicationRef) {
    appRef.bootstrap(AppComponent);
  }
}
