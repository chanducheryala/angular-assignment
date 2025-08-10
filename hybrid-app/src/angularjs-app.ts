/**
 * AngularJS application setup
 * This file sets up the AngularJS application and its modules
 */

import 'angular';
import angular from 'angular';
import 'angular-ui-router';

// Define the main AngularJS module
const hybridApp = angular.module('hybridApp', [
  'ui.router',
  'app.auth'  // Our authentication module
]);

// Export the module for use in other files
export default hybridApp;
