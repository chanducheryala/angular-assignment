import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { setAngularJSGlobal } from '@angular/upgrade/static';
import * as angular from 'angular';

import './ng1-app';

setAngularJSGlobal(angular);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error('Error bootstrapping application', err));
