import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

// ✅ Declare custom validator outside of the component
export function allowedEmailDomain(allowedDomains: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email: string = control.value;
    if (!email) return null;
    const domain = email.substring(email.lastIndexOf('@') + 1).toLowerCase();
    return allowedDomains.includes(domain) ? null : { emailDomain: true };
  };
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './user.html',
  styleUrls: ['./user.css']
})
export class UserComponent {
  currentForm: 'user' | 'admin' = 'user';
  isLogin = true;

  loginForm: FormGroup;
  registerForm: FormGroup;
  adminLoginForm: FormGroup;

  showLoginPassword = false;
  showRegisterPassword = false;
  showAdminPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.email,
        allowedEmailDomain(['gmail.com', 'yahoo.com', 'hotmail.com'])
      ]],
      address: ['', Validators.required],
      phone: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
      ]]
    });

    this.adminLoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
  get adminEmail() { return this.adminLoginForm.get('email'); }
  get adminPassword() { return this.adminLoginForm.get('password'); }

  toggleForm(form: 'login' | 'register' | 'admin') {
    this.currentForm = form === 'admin' ? 'admin' : 'user';
    this.isLogin = (form === 'login');
  }

  togglePassword(type: 'login' | 'register' | 'admin') {
    if (type === 'login') this.showLoginPassword = !this.showLoginPassword;
    if (type === 'register') this.showRegisterPassword = !this.showRegisterPassword;
    if (type === 'admin') this.showAdminPassword = !this.showAdminPassword;
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.authService.login(this.loginForm.value).subscribe({
      next: () => this.router.navigate(['/user-area']),
      error: () => alert('Invalid user credentials.')
    });
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        alert('Registration successful! Please log in.');
        this.registerForm.reset();
        this.toggleForm('login');
      },
      error: () => alert('Registration failed. Please try again.')
    });
  }

  onAdminLogin() {
    if (this.adminLoginForm.invalid) {
      this.adminLoginForm.markAllAsTouched();
      return;
    }
    this.authService.adminLogin(this.adminLoginForm.value).subscribe({
      next: () => this.router.navigate(['/admin']),
      error: () => alert('Invalid admin credentials.')
    });
  }
}
