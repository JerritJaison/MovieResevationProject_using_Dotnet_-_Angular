import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking-service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; // Import ActivatedRoute
import { switchMap } from 'rxjs/operators'; // Import switchMap
import { Show } from '../../services/booking-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.html',
  standalone: true,
  styleUrls:['./booking.css'],
  imports: [CommonModule,FormsModule]
})
export class BookingComponent implements OnInit {
  movieId: number = 0; // Initialize with 0 or null
  shows: Show[] = [];
  selectedShow: Show | null = null;
  bookingConfirmedMessage: string | null = null;
  selectedDate: string = '';

  constructor(private bookingService: BookingService, private route: ActivatedRoute, private router: Router) {} // Inject ActivatedRoute

  ngOnInit(): void {
    this.selectedDate = this.getToday();
    // Get movieId from route parameters
    this.route.paramMap.pipe(
      switchMap(params => {
        this.movieId = +params.get('movieId')!; // The '+' converts the string to a number
        return this.bookingService.getShowsByMovie(this.movieId);
      })
    ).subscribe({
      next: (data) => {
        this.shows = data;
        if (data.length > 0) {
          this.selectedShow = data[0];
          this.bookingConfirmedMessage = null;

        }
      },
      error: (err) => {
        console.error('Error fetching shows:', err);
        this.bookingConfirmedMessage = 'Failed to load shows. Please try again later.';
      }
    });
  }

  selectShow(show: Show): void {
    this.selectedShow = show;
    this.bookingConfirmedMessage = null;
  }

  confirmBooking(showToBook: Show): void {
    if (showToBook) {
      this.selectedShow = showToBook;
      this.bookingConfirmedMessage =
        `Booking confirmed for: ` +
        `Theater: ${showToBook.theater?.name}, ` +
        `Time: ${showToBook.startTime}. ` +
        `Enjoy your movie!`;
    } else {
      this.bookingConfirmedMessage = 'Error: No show selected for booking.';
    }
  }

  goToSeatSelection(show: Show): void {
  const movieId = this.movieId;
  const screenId = show.screenId;
  const theaterId = show.theaterId;
  const showId = show.showId;

  this.router.navigate(['/seat-selection', movieId, screenId, theaterId, showId]);
}


  onDateChange() {
    console.log('Date changed:', this.selectedDate);
    // You can fetch/filter shows based on the selectedDate here
  }

  getToday(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  }
}