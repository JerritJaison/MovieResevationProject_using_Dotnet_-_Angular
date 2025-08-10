import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin';
import { IAdmin } from '../../models/IAdmin';

@Component({
  selector: 'app-admin-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-update.html',
  styleUrls: ['./admin-update.css']
})
export class AdminEditComponent implements OnInit {
  adminId!: number;
  updateForm!: FormGroup;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.adminId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.adminId) this.loadAdmin();
  }

  buildForm(): void {
    this.updateForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  loadAdmin(): void {
    this.adminService.getById(this.adminId).subscribe({
      next: (data) => {
        this.updateForm.patchValue({
          username: data.username,
          password: data.password,
          email: data.email
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load admin', err);
        this.isLoading = false;
      }
    });
  }

  onUpdate(): void {
    if (this.updateForm.invalid) return;
    const updatedAdmin: IAdmin = { adminId: this.adminId, ...this.updateForm.value };

    this.adminService.update(updatedAdmin).subscribe({
      next: (res) => {
        alert(res || 'Admin updated successfully');
        this.router.navigate(['/admin/view']);
      },
      error: (err) => {
        console.error('Update failed', err);
        alert('Update failed, check console for details.');
      }
    });
  }

  back(): void {
    this.router.navigate(['/admin/view']);
  }
  showPassword = false;

togglePassword(): void {
  this.showPassword = !this.showPassword;
}

}
