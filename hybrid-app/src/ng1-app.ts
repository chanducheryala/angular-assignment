/**
 * AngularJS application bootstrap
 * This file initializes the AngularJS application and its modules
 * before the Angular application is bootstrapped.
 */

// Import the AngularJS application setup
import './angularjs-app';

// Import the auth module which will register its components
import './app/auth/ng1/auth.module';

// Export the module name for use in main.ts
export default 'hybridApp';
