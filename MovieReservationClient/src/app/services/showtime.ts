import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IShowTime } from '../models/IShowTime';

@Injectable({ providedIn: 'root' })
export class ShowTimeService {
  private apiUrl = 'http://localhost:5180/api/ShowTimeAPI';

  constructor(private http: HttpClient) {}

  // Add a new showtime (with movieId included)
  addShowTime(showTime: IShowTime & { movieId: number }): Observable<string> {
    return this.http.post(`${this.apiUrl}/AddShow`, showTime, { responseType: 'text' });
  }

  // Get all showtimes
  getAllShowTimes(): Observable<IShowTime[]> {
    return this.http.get<IShowTime[]>(`${this.apiUrl}/ViewAllShows`);
  }

  // Get all showtimes for a specific theater
  getShowTimesByTheater(theaterId: number): Observable<IShowTime[]> {
    return this.http.get<IShowTime[]>(`${this.apiUrl}/ViewShowTimingsByTheater/${theaterId}`);
  }
}
