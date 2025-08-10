import 'angular';
import angular from 'angular';
import 'angular-ui-router';

const hybridApp = angular.module('hybridApp', [
  'ui.router',
  'app.auth'
]);

export default hybridApp;
