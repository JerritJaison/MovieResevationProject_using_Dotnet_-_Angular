import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAdmin } from '../models/IAdmin';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private baseUrl = 'http://localhost:5180/api/AdminAPI';

  constructor(private http: HttpClient, private auth: AuthService) {}

  getAll(): Observable<IAdmin[]> {
    return this.http.get<IAdmin[]>(`${this.baseUrl}/GetAllAdmins`);
  }

  getById(id: number): Observable<IAdmin> {
    return this.http.get<IAdmin>(`${this.baseUrl}/GetAdminById/${id}`);
  }

  getLoggedInAdminId(): number | null {
    return this.auth.getLoggedInUserId();
  }

  add(admin: IAdmin): Observable<any> {
    return this.http.post(`${this.baseUrl}/Register`, admin, { responseType: 'text' });
  }

  update(admin: IAdmin): Observable<any> {
    return this.http.put(`${this.baseUrl}/UpdateAdmin`, admin, { responseType: 'text' });
  }

  deleteById(id: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/DeleteAdmin/${id}`, { responseType: 'text' });
}

  deleteLoggedIn(): Observable<any> {
    const myId = this.getLoggedInAdminId();
    if (myId == null) throw new Error('No logged-in admin id found');
    return this.deleteById(myId);
  }
}
