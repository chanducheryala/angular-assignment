import angular from "angular";


export class AuthService {
  static $inject = ['$q', '$timeout', '$window'];
  
  private readonly AUTH_TOKEN_KEY = 'authToken';
  private readonly USER_DATA_KEY = 'userData';
  
  constructor(
    private $q: ng.IQService,
    private $timeout: ng.ITimeoutService,
    private $window: ng.IWindowService
  ) {}

  login(username: string, password: string): ng.IPromise<any> {
    const deferred = this.$q.defer();

    this.$timeout(() => {
      if (username === 'admin' && password === 'admin') {
        const userData = {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          roles: ['admin']
        };
        
        this.storeUserData(userData);
        const result = {
          ...userData,
          $promise: deferred.promise
        };
        
        deferred.resolve(result);
      } else {
        deferred.reject({ message: 'Invalid username or password' });
      }
    }, 1000);
    const promise = deferred.promise as any;
    promise.$promise = promise;
    return promise;
  }

  logout(): void {
    this.clearUserData();
  }
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  getCurrentUser(): any | null {
    const userData = this.$window.localStorage.getItem(this.USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  }


  getToken(): string | null {
    return this.$window.localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  private storeUserData(userData: any): void {
    const token = 'dummy-jwt-token';
    this.$window.localStorage.setItem(this.AUTH_TOKEN_KEY, token);
    this.$window.localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
  }

  private clearUserData(): void {
    this.$window.localStorage.removeItem(this.AUTH_TOKEN_KEY);
    this.$window.localStorage.removeItem(this.USER_DATA_KEY);
  }
}

const app = angular.module('hybridApp');
if (app) {
  app.service('authService', AuthService);
} else {
  console.warn('hybridApp module not found when registering authService');
}
