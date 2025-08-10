/**
 * AngularJS Authentication Module
 */

import angular from "angular";
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';

// Create the AngularJS module
const authModule = angular.module('app.auth', ['ui.router']);

// Register services
authModule.service('authService', AuthService);

// Register controllers
authModule.controller('AuthController', AuthController);

export default authModule.name;
