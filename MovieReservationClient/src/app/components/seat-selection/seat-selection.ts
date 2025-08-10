import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router'; // ✅ Added Router
import { ISeat } from '../../models/ISeat';
import { IMovie } from '../../models/IMovie';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie';
import { CanComponentDeactivate } from '../../guards/unsaved-changes-guard';
import { IShowDetail } from '../../models/IShowDetail';
import { AuthService } from '../../services/auth';

declare var Razorpay: any;

@Component({
  selector: 'app-seat-selection',
  templateUrl: './seat-selection.html',
  styleUrls: ['./seat-selection.css'],
  standalone: true,
  imports: [CommonModule]
})
export class SeatSelectionComponent implements OnInit, CanComponentDeactivate {
  seats: ISeat[] = [];
  seatsByRow: { [row: string]: ISeat[] } = {};
  seatRows: string[] = [];
  totalAmount = 0;
  selectedSeatCount = 0;
  selectedSeats: string[] = [];
  theaterId = 0;
  showId = 0;
  showDetails!: IShowDetail;

  screenId = 0;
  movieId = 0;
  movie: IMovie | null = null;
  showModal = false;
  showLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,              // ✅ Inject Router
    private movieService: MovieService,
    private authService: AuthService     // ✅ Inject AuthService
  ) {}

  ngOnInit(): void {
    this.screenId = Number(this.route.snapshot.paramMap.get('screenId'));
    this.movieId = Number(this.route.snapshot.paramMap.get('movieId'));
    this.theaterId = Number(this.route.snapshot.paramMap.get('theaterId'));
    this.showId = Number(this.route.snapshot.paramMap.get('showId'));

    this.fetchSeats();
    this.fetchMovieDetails();
    this.fetchShowDetails();
  }

  fetchSeats(): void {
    this.http.get<ISeat[]>(`http://localhost:5180/api/Seat/show/${this.showId}/screen/${this.screenId}`)
      .subscribe(data => {
        this.seats = data.map(seat => ({
          ...seat,
          isSelected: false,
          row: seat.seatNumber.charAt(0)
        }));
        this.groupSeatsByRow();
        this.calculateTotal();
      });
  }

  fetchMovieDetails(): void {
    this.movieService.getMovieById(this.movieId).subscribe({
      next: data => this.movie = data,
      error: err => console.error('Failed to load movie', err)
    });
  }

  fetchShowDetails(): void {
    this.http.get<any>(`http://localhost:5180/api/Seat/ShowDetails/${this.showId}`)
      .subscribe({
        next: data => this.showDetails = data,
        error: err => console.error('Error fetching show details', err)
      });
  }

  groupSeatsByRow(): void {
    this.seatsByRow = {};
    for (const seat of this.seats) {
      const row = seat.row!;
      if (!this.seatsByRow[row]) {
        this.seatsByRow[row] = [];
      }
      this.seatsByRow[row].push(seat);
    }
    this.seatRows = Object.keys(this.seatsByRow);
  }

  toggleSeat(seat: ISeat): void {
    if (seat.isBooked) return;

    seat.isSelected = !seat.isSelected;

    this.selectedSeats = this.seats
      .filter(s => s.isSelected)
      .map(s => s.seatNumber);

    this.selectedSeatCount = this.selectedSeats.length;
    this.totalAmount = this.seats
      .filter(s => s.isSelected)
      .reduce((sum, s) => sum + s.price, 0);
  }

  confirmBooking(): void {
    if (this.selectedSeatCount === 0) {
      alert("Please select at least one seat.");
      return;
    }
    this.showModal = true;
  }

  cancelModal(): void {
    this.showModal = false;
  }

  calculateTotal(): void {
    const selected = this.seats.filter(s => s.isSelected);
    this.totalAmount = selected.reduce((sum, seat) => sum + seat.price, 0);
    this.selectedSeatCount = selected.length;
  }

  canDeactivate(): boolean {
    if (this.selectedSeatCount !== 0) {
      return confirm('You have selected seats but not booked. Do you really want to leave?');
    }
    return true;
  }

  confirmBookingNow(): void {
  const selectedSeatIds = this.seats
    .filter(s => s.isSelected)
    .map(s => s.seatId);

  const seatNumbers = this.seats
    .filter(s => s.isSelected)
    .map(s => s.seatNumber); // 👈 Save before clearing

  const userId = this.authService.getLoggedInUserOnlyId();

  const bookingData = {
    seatIds: selectedSeatIds,
    userId: userId,
    showId: this.showId,
    totalPrice: this.totalAmount
  };
  this.showLoading = true;
  this.http.post<any>('http://localhost:5180/api/BookedSeat/create-order', {
    totalAmount: this.totalAmount
  }).subscribe({
    next: order => {
      const options: any = {
        key: 'rzp_test_2VUTqUajDEKWnU',
        amount: order.amount,
        currency: order.currency,
        name: 'Movie Booking',
        description: 'Ticket Booking Payment',
        order_id: order.orderId,
        handler: (response: any) => {
          const bookingPayload = {
            ...bookingData,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature
          };

          // Step 1: Book the seats
          this.http.post<any>('http://localhost:5180/api/BookedSeat/book', bookingPayload)
            .subscribe({
              next: res => {
                const bookingId = res.bookingId;

                // Step 2: Send email
                const confirmPayload = {
                  bookingId: bookingId,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature
                };

                this.http.post('http://localhost:5180/api/payment/confirm', confirmPayload)
                  .subscribe({
                    next: () => {
                      alert('Seats booked successfully! Email sent.');

                      // Step 3: Redirect AFTER email
                      this.router.navigate(['/booking-confirmation'], {
                        queryParams: {
                          seatNo: seatNumbers.join(','),
                          theatreName: this.showDetails.theaterName,
                          screenName: this.showDetails.screenType,
                          showtime: this.showDetails.showTime,
                          movieId: this.movieId
                        }
                      });

                      // Step 4: Clear state AFTER redirect triggered
                      this.seats.forEach(seat => seat.isSelected = false);
                      this.selectedSeats = [];
                      this.selectedSeatCount = 0;
                      this.totalAmount = 0;
                      this.fetchSeats();
                      this.showModal = false;
                    },
                    error: err => {
                      console.error('Email failed to send:', err);
                      alert('Booking successful, but email failed.');
                    }
                  });
              },
              error: () => {
                alert('Payment verified but booking failed.');
              }
            });
        },
        prefill: {
          name: 'Your Name',
          email: 'user@example.com'
        },
        theme: {
          color: '#3399cc'
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();
    },
    error: err => {
      console.error('Order creation failed', err);
      alert('Unable to create payment order.');
    }
  });
}



}
