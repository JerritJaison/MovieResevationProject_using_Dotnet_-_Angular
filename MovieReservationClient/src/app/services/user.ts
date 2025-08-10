import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../models/IUser';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:5180/api/UsersAPI';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.apiUrl);
  }

  getUserById(userId: number): Observable<IUser> {
    return this.http.get<IUser>(`${this.apiUrl}/${userId}`);
  }

  update(user: IUser): Observable<any> {
    return this.http.put(`${this.apiUrl}/Update`, user, { responseType: 'text' });
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Delete/${userId}`, { responseType: 'text' });
  }
}
