import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin';
import { AuthService } from '../../services/auth';
import { IAdmin } from '../../models/IAdmin';

@Component({
  selector: 'app-admin-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-detail.html',
  styleUrls: ['./admin-detail.css']
})
export class AdminViewComponent implements OnInit {
  admins: IAdmin[] = [];
  filteredAdmins: IAdmin[] = [];
  searchTerm = '';

  constructor(
    private adminService: AdminService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchAdmins();
  }

  /** Fetch all admins */
  fetchAdmins(): void {
    this.adminService.getAll().subscribe({
      next: (data) => {
        this.admins = data;
        this.filteredAdmins = data;
      },
      error: (err) => console.error('Failed to load admins', err)
    });
  }

  /** Filter admins */
  filter(): void {
    const t = this.searchTerm.toLowerCase().trim();
    this.filteredAdmins = !t
      ? this.admins
      : this.admins.filter(a =>
          a.username.toLowerCase().includes(t) ||
          a.email.toLowerCase().includes(t)
        );
  }

  /** Update logged-in admin */
  updateLoggedInAdmin(): void {
    const loggedInId = this.auth.getLoggedInUserId();
    if (loggedInId) {
      this.router.navigate([`/admin/edit/${loggedInId}`]);
    } else {
      alert('Unable to find logged-in admin ID.');
    }
  }

  /** Triggered by modal button */
  confirmDelete(): void {
    this.adminService.deleteLoggedIn().subscribe({
      next: () => {
        this.closeModal(); // Close modal & remove backdrop
        alert('Your account has been deleted.');
        this.auth.logout();
      },
      error: (err) => {
        this.closeModal(); // Ensure modal closes even on error
        console.error('Delete failed', err);
        alert('Failed to delete account.');
      }
    });
  }

  /** Utility to close modal and remove backdrop */
  private closeModal() {
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
    }

    // Remove all modal backdrops
    const backdrops = document.getElementsByClassName('modal-backdrop');
    while (backdrops.length > 0) {
      backdrops[0].parentNode?.removeChild(backdrops[0]);
    }

    // Reset body styles
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }

  /** Navigate back */
  backToAdminArea(): void {
    this.router.navigate(['/admin']);
  }
}
