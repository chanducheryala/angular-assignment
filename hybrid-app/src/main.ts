import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { setAngularJSGlobal } from '@angular/upgrade/static';
import * as angular from 'angular';

// Import the AngularJS application initialization
import './ng1-app';

// Set AngularJS global
setAngularJSGlobal(angular);

// Bootstrap the application
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error('Error bootstrapping application', err));
