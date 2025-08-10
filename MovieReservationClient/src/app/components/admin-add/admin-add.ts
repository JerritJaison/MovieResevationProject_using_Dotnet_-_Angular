import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin';
import { IAdmin } from '../../models/IAdmin';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin-add.html',
  styleUrls: ['./admin-add.css']
})
export class AdminAddComponent {
  adminForm: FormGroup;
  submitting = false;
  serverError: string | null = null;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router 
  ) {
    this.adminForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.serverError = null;
    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const newAdmin: IAdmin = this.adminForm.value;

    this.adminService.add(newAdmin).subscribe({
      next: () => {
        this.submitting = false;
        alert('Admin added successfully!');
        this.router.navigate(['/admin/view']);
      },
      error: (err) => {
        this.submitting = false;
        this.serverError = err?.error ?? 'Failed to add admin';
        console.error('Error adding admin:', err);
      }
    });
  }
  goBack() {
  this.router.navigate(['/admin']);
}

}
