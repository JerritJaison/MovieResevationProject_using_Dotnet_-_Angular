import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface BookingInfo {
  bookingId: number;
  showTime: string;
  screenName: string;
  theaterName: string;
  seatNumbers: string[];
  movieId: number;
  imageUrl: string;
  movieName: string;
}

@Component({
  selector: 'app-booking-display',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bookingdisplay.html',
  styleUrls: ['./bookingdisplay.css']
})
export class BookingDisplayComponent implements OnInit {
  bookingDetails: BookingInfo[] = [];
  filteredBookingDetails: BookingInfo[] = [];
  isLoading: boolean = true;
  searchTerm: string = '';

  constructor(private bookingService: BookingService, private router: Router) {}

  ngOnInit(): void {
    this.loadAllBookings();
  }

  loadAllBookings(): void {
    this.bookingService.getAllBookingIds().subscribe({
      next: (ids: number[]) => {
        if (!ids || ids.length === 0) {
          this.isLoading = false;
          return;
        }

        let loaded = 0;
        ids.forEach(id => {
          this.bookingService.getBookingDetails(id).subscribe({
            next: (booking: BookingInfo) => {
              this.bookingDetails = [...this.bookingDetails, booking];
              this.filteredBookingDetails = [...this.bookingDetails]; // Update filtered list
              loaded++;
              if (loaded === ids.length) {
                this.isLoading = false;
              }
            },
            error: err => {
              console.error(`Error fetching booking ${id}`, err);
              loaded++;
              if (loaded === ids.length) {
                this.isLoading = false;
              }
            }
          });
        });
      },
      error: err => {
        console.error("Error fetching booking IDs", err);
        this.isLoading = false;
      }
    });
  }

  searchBookings(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredBookingDetails = [...this.bookingDetails];
      return;
    }
    this.filteredBookingDetails = this.bookingDetails.filter(b =>
      b.movieName.toLowerCase().includes(term) ||
      b.theaterName.toLowerCase().includes(term) ||
      b.screenName.toLowerCase().includes(term) ||
      b.seatNumbers.some(seat => seat.toLowerCase().includes(term))
    );
  }

  backToAdminArea(): void {
     this.router.navigate(['/admin']);
  }
}
