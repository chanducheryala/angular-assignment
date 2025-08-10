import ng from "angular";
import angular from "angular";

interface IAuthScope extends ng.IScope {
  username: string;
  password: string;
  error: string;
  isLoading: boolean;
  login(): void;
  logout(): void;
  isAuthenticated(): boolean;
  currentUser: any;
}

export class AuthController {
  static $inject = ['$scope', 'authService', '$state', '$window', '$timeout'];

  constructor(
    private $scope: IAuthScope,
    private authService: any,
    private $state: ng.ui.IStateService,
    private $window: ng.IWindowService,
    private $timeout: ng.ITimeoutService
  ) {
    this.initialize();
  }

  private initialize(): void {
    this.initializeScope();
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    if (this.isAuthenticated()) {
      this.authService.getCurrentUser()
        .then((user: any )=> {
          this.$scope.currentUser = user;
          this.redirectBasedOnRole(user?.role || 'user');
        })
        .catch(() => {
          this.authService.logout();
          this.$scope.currentUser = null;
        });
    }
  }

  private redirectBasedOnRole(role: string): void {
    const defaultState = role === 'admin' ? 'admin.dashboard' : 'dashboard';
    if (this.$state.current.name === 'login') {
      this.$state.go(defaultState);
    }
  }


  private initializeScope(): void {
    this.$scope.username = '';
    this.$scope.password = '';
    this.$scope.error = '';
    this.$scope.isLoading = false;
    this.$scope.currentUser = null;

    this.$scope.login = () => this.login();
    this.$scope.logout = () => this.logout();
    this.$scope.isAuthenticated = () => this.isAuthenticated();
  }


  private login(): void {
    if (!this.$scope.username || !this.$scope.password) {
      this.$scope.error = 'Please enter both username and password';
      return;
    }

    this.$scope.isLoading = true;
    this.$scope.error = '';

    this.authService.login(this.$scope.username, this.$scope.password)
      .then((user: any) => {
        this.$scope.currentUser = user;
        this.redirectBasedOnRole(user.role || 'user');
      })
      .catch((error: any) => {
        this.$scope.error = error.message || 'Login failed. Please try again.';
        this.$scope.password = ''; 
      })
      .finally(() => {
        this.$scope.isLoading = false;
        this.$scope.$apply();
      });
  }



  /**
   * Handle user logout
   */
  private logout(): void {
    this.authService.logout();
    this.$scope.currentUser = null;
    this.$state.go('login');
  }

  /**
   * Check if user is authenticated
   * @returns boolean indicating authentication status
   */
  private isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

}

// Safely register the controller with the hybridApp module
const app = angular.module('hybridApp');
if (app) {
  app.controller('AuthController', AuthController);
} else {
  console.warn('hybridApp module not found when registering AuthController');
}
