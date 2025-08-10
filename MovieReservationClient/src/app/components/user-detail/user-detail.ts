import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user';
import { IUser } from '../../models/IUser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-detail.html',
  styleUrls: ['./user-detail.css']
})
export class UserDetailComponent implements OnInit {
  users: IUser[] = [];
  filteredUsers: IUser[] = [];
  searchTerm: string = '';

  constructor(private userService: UserService,private router: Router,) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
      },
      error: (err) => console.error('Error fetching users', err)
    });
  }

  searchUsers(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          alert('User deleted successfully!');
          this.users = this.users.filter((u) => u.userId !== userId);
          this.filteredUsers = this.filteredUsers.filter((u) => u.userId !== userId);
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert('Failed to delete user. Check console for details.');
        }
      });
    }
  }

  refreshUsers(): void {
    this.searchTerm = '';
    this.loadUsers();
  }

  trackByUserId(index: number, user: IUser): number {
    return user.userId;
  }
  backToAdminArea(): void {
    this.router.navigate(['/admin']);
  }
}
