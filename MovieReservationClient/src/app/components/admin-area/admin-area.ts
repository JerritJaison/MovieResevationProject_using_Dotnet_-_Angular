import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

interface AdminCard {
  title: string;
  route?: string;   
  key: string;    
}

@Component({
  selector: 'app-admin-area',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-area.html',
  styleUrls: ['./admin-area.css']
})
export class AdminArea {
  searchTerm = '';

  // Only 4 cards (User, Movie, Theatre, Booking)
  cards: AdminCard[] = [
    { title: 'User',    route: '/admin/users',    key: 'user users manage' },
    { title: 'Movie',   route: '/admin/movies',   key: 'movie movies manage' },
    { title: 'Theatre', route: '/admin/theatres', key: 'theatre theaters cinemas' },
    { title: 'Booking', route: 'bookingview', key: 'booking bookings reservations' }
  ];

  constructor(private router: Router, private auth: AuthService) {}

  get filteredCards(): AdminCard[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.cards;
    return this.cards.filter(c =>
      c.title.toLowerCase().includes(term) || c.key.includes(term)
    );
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.auth.logout();
    }
  }

  openInfo(card: AdminCard) {
    if (card.route) {
      this.router.navigate([card.route]);
    }
  }
  viewAdmin() {
  this.router.navigate(['/admin/view']);
}

addAdmin() {
  this.router.navigate(['/admin/add']); 
}

}
