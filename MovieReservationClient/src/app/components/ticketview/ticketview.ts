import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking-service';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-ticket-view',
  templateUrl: './ticketview.html',
  styleUrls: ['./ticketview.css']
})
export class TicketViewComponent implements OnInit {
  bookingId!: number;
  screenName = '';
  theatreName = '';
  showTime = '';
  movieName = '';
  seatNo: string[] = [];
  posterPath = '';

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.launchConfetti();
    this.route.queryParams.subscribe(params => {
      this.bookingId = +params['bookingId'];
      if (this.bookingId) {
        this.fetchTicketDetails(this.bookingId);
      }
    });
  }

  fetchTicketDetails(bookingId: number): void {
    this.bookingService.getBookingDetails(bookingId).subscribe(
      (data) => {
        this.screenName = data.screenName;
        this.theatreName = data.theaterName;
        this.showTime = data.showTime;
        this.movieName = data.movieName;
        this.posterPath = data.imageUrl;
        this.seatNo = data.seatNumbers;
      },  
      (error) => {
        console.error('Error fetching ticket details:', error);
      }
    );
  }

  cancelBooking(): void {
    if (!this.bookingId) {
      alert('Invalid booking ID');
      return;
    }

    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelBooking(this.bookingId).subscribe({
        next: () => {
          alert('Booking cancelled successfully.');
          this.router.navigate(['/user-area']);
        },
        error: (err) => {
          console.error('Failed to cancel booking:', err);
          alert('Cancellation failed. Please try again.');
        }
      });
    }
  }

  goToBookingConfirmation(): void {
    this.router.navigate(['/user-area']);
  }
   launchConfetti() {
    // Left-side burst
    confetti({
      angle: 60,
      spread: 55,
      particleCount: 50,
      origin: { x: 0 }, // Left
    });

    // Right-side burst
    confetti({
      angle: 120,
      spread: 55,
      particleCount: 50,
      origin: { x: 1 }, // Right
    });

    // Optional center burst after delay
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 500);
  }
}
