import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITheater } from '../models/ITheater';

@Injectable({ providedIn: 'root' })
export class TheaterService {
  private apiUrl = 'http://localhost:5180/api/Theater';

  constructor(private http: HttpClient) {}

  getAllTheaters(): Observable<ITheater[]> {
    return this.http.get<ITheater[]>(this.apiUrl);
  }
}
