import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class UserProfileComponent implements OnInit {
  user: any = null;
  loading = true;
  error = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getLoggedInUserOnlyId();  // ✅ using the new method
    console.log('Decoded userId:', userId);

    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: res => {
          this.user = res;
          this.loading = false;
        },
        error: err => {
          console.error('Error fetching user:', err);
          this.error = 'Unable to load profile. Please login again.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'Unable to load profile. Please login again.';
      this.loading = false;
    }
  }

  confirmDelete(): void {
    const userId = this.authService.getLoggedInUserOnlyId();
    if (!userId) {
      alert('Invalid user ID. Please login again.');
      return;
    }

    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.closeModal();
        alert('Your account has been deleted.');
        this.authService.logout();
      },
      error: err => {
        this.closeModal();
        console.error('Error deleting user:', err);
        alert('Failed to delete account.');
      }
    });
  }

  private closeModal() {
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
    }

    const backdrops = document.getElementsByClassName('modal-backdrop');
    while (backdrops.length > 0) {
      backdrops[0].parentNode?.removeChild(backdrops[0]);
    }

    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }

  navigateToUpdate(): void {
    this.router.navigate(['/user/update']);
  }
  backToUserArea(): void {
    this.router.navigate(['/user-area']);
  }
}
