import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IMovie } from '../models/IMovie';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private apiUrl = 'http://localhost:5180/api/MovieAPI';

  constructor(private http: HttpClient) {}

  getAllMovies(): Observable<IMovie[]> {
    return this.http.get<IMovie[]>(this.apiUrl);
  }

  addMovie(movie: IMovie): Observable<number> {
    return this.http.post<number>(this.apiUrl, movie);
  }

  deleteMovie(movieId: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${movieId}`, { responseType: 'text' });
  }
  getMovieById(movieId: number): Observable<IMovie> {
  return this.http.get<IMovie>(`${this.apiUrl}/${movieId}`);
}
}

