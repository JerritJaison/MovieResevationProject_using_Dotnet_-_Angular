import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Show {
  showId: number;
  movieId: number;
  screenId: number;
  theaterId: number;
  startTime: string;
  showDate: string;
  ticketPrice: number;
  movie: any | null;
  screen: {
    screenId: number;
    theaterId: number;
    screenName: string;
    totalSeats: number;
    type: string;
  };
  theater: {
    theaterId: number;
    name: string;
    city: string;
    screens: any[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private showTimeApi = 'http://localhost:5180/api/ShowTimeAPI';
  private bookingApi = 'http://localhost:5180/api/Booking';

  constructor(private http: HttpClient) {}

  // Get all shows by movie
  getShowsByMovie(movieId: number): Observable<Show[]> {
    return this.http.get<Show[]>(`${this.showTimeApi}/ViewShowTimings/${movieId}`);
  }

  // Get booking details by bookingId
  getBookingDetails(bookingId: number): Observable<any> {
    return this.http.get<any>(`${this.bookingApi}/ticket/${bookingId}`);
  }

  // Get all booking IDs
  getAllBookingIds(): Observable<number[]> {
    return this.http.get<number[]>(`${this.bookingApi}/all-booking-ids`);
  }

  // ✅ Cancel booking by ID
 cancelBooking(bookingId: number): Observable<void> {
  return this.http.delete<void>(`${this.bookingApi}/Admin/Cancel/${bookingId}`);
}

}
