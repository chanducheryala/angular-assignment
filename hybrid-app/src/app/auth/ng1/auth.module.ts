import angular from "angular";
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';

const authModule = angular.module('app.auth', ['ui.router']);

authModule.service('authService', AuthService);

authModule.controller('AuthController', AuthController);

export default authModule.name;
