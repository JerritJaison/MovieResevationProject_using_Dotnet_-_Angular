import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user';
import { AuthService } from '../../services/auth';
import { IUser } from '../../models/IUser';

@Component({
  selector: 'app-user-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './user-update.html',
  styleUrls: ['./user-update.css']
})
export class UserUpdateComponent implements OnInit {
  updateForm!: FormGroup;
  isLoading = true;
  userId!: number;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.authService.getLoggedInUserOnlyId();

    if (id === null) {
      alert('User not logged in.');
      this.router.navigate(['/login']);
      return;
    }

    this.userId = id;
    this.buildForm();
    this.loadUser();
  }

  buildForm(): void {
    this.updateForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  loadUser(): void {
    this.userService.getUserById(this.userId).subscribe({
      next: (user: IUser) => {
        this.updateForm.patchValue(user);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load user', err);
        alert('Could not load user data.');
        this.isLoading = false;
      }
    });
  }

  onUpdate(): void {
    if (this.updateForm.invalid) return;
    const updatedUser: IUser = { userId: this.userId, ...this.updateForm.value };

    this.userService.update(updatedUser).subscribe({
      next: (res) => {
        alert(res || 'User updated successfully');
        this.router.navigate(['profile']);
      },
      error: (err) => {
        console.error('Update failed', err);
        alert('Update failed, check console for details.');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['profile']);
  }
  showPassword = false;

togglePassword(): void {
  this.showPassword = !this.showPassword;
}

}
