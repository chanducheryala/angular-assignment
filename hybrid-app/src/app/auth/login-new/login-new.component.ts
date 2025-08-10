import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

declare const angular: any;

@Component({
  selector: 'app-login-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <h2>Login</h2>
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="username">Username</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              [(ngModel)]="username" 
              required 
              class="form-control"
              placeholder="Enter your username"
            >
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              [(ngModel)]="password" 
              required 
              class="form-control"
              placeholder="Enter your password"
            >
          </div>
          <button 
            type="submit" 
            class="btn btn-primary" 
            [disabled]="!loginForm.form.valid || isLoading"
          >
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>
          <div *ngIf="error" class="error-message">
            {{ error }}
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    .login-box {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }
    h2 {
      text-align: center;
      margin-bottom: 1.5rem;
      color: #333;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    .btn {
      width: 100%;
      padding: 0.75rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 1rem;
    }
    .btn-primary {
      background-color: #007bff;
      color: white;
    }
    .btn-primary:disabled {
      background-color: #b3d7ff;
      cursor: not-allowed;
    }
    .error-message {
      color: #dc3545;
      margin-top: 1rem;
      text-align: center;
    }
  `]
})
export class LoginNewComponent implements OnInit, OnDestroy {
  username = '';
  password = '';
  isLoading = false;
  error = '';
  private authService: any;
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  constructor() {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.angular) {
      try {
        const $injector = angular.element(document.body).injector();
        if ($injector) {
          this.authService = $injector.get('authService');
        } else {
          console.warn('AngularJS injector not available');
        }
      } catch (error) {
        console.error('Failed to get AngularJS services:', error);
      }
    } else {
      console.warn('AngularJS not available');
    }
  }

  ngOnDestroy(): void {
    // Clean up if needed
  }

  async onSubmit(): Promise<void> {
    if (!this.username || !this.password) {
      return;
    }

    this.isLoading = true;
    this.error = '';

    try {
      if (!this.authService) {
        throw new Error('Authentication service not available');
      }

      // Handle AngularJS promise properly
      const loginPromise = this.authService.login(this.username, this.password);
      
      // Check if it's an AngularJS promise ($promise property exists)
      const result = loginPromise.$promise 
        ? await loginPromise.$promise 
        : await Promise.resolve(loginPromise);
      
      if (result) {
        // Store only the necessary data in localStorage
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('authToken', result.token || 'dummy-token');
          
          // Create a clean user object without circular references
          const userData = {
            username: result.username || this.username,
            email: result.email,
            // Add other non-circular properties you need
          };
          
          localStorage.setItem('userData', JSON.stringify(userData));
        }
        
        // Navigate to the dashboard or return URL
        const returnUrl = this.router.parseUrl(this.router.url).queryParams['returnUrl'] || '/dashboard';
        this.router.navigateByUrl(returnUrl);
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      this.error = error?.message || 'Invalid username or password';
      this.password = ''; 
    } finally {
      this.isLoading = false;
    }
  }
}
