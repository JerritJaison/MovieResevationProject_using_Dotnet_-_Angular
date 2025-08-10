import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IScreen } from '../models/IScreen';

@Injectable({ providedIn: 'root' })
export class ScreenService {
  private apiUrl = 'http://localhost:5180/api/ScreenAPI';

  constructor(private http: HttpClient) {}

  getAllScreens(): Observable<IScreen[]> {
  return this.http.get<IScreen[]>(`${this.apiUrl}/GetAllScreens`);
}

}
