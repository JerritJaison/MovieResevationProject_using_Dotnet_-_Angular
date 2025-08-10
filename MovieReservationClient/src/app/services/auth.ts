import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly USER_TOKEN_KEY = 'userToken';
  private readonly ADMIN_TOKEN_KEY = 'adminToken';

  private loginUrl       = 'http://localhost:5180/api/UserAuth/login';
  private registerUrl    = 'http://localhost:5180/api/UsersAPI/Register';
  private adminLoginUrl  = 'http://localhost:5180/api/AdminAuth/login';

  constructor(private http: HttpClient, private router: Router) {}

  // USER LOGIN
  login(model: { email: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.loginUrl, model).pipe(
      tap(res => localStorage.setItem(this.USER_TOKEN_KEY, res.token))
    );
  }

  // ADMIN LOGIN
  adminLogin(model: { email: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.adminLoginUrl, model).pipe(
      tap(res => {
        localStorage.setItem(this.ADMIN_TOKEN_KEY, res.token);
        localStorage.setItem('role', 'Admin');
      })
    );
  }

  // USER REGISTER
  register(model: { name: string; email: string; address: string; phone: string; password: string }): Observable<any> {
    return this.http.post(this.registerUrl, model, { responseType: 'text' });  
  }

  logout(): void {
    localStorage.removeItem(this.USER_TOKEN_KEY);
    localStorage.removeItem(this.ADMIN_TOKEN_KEY);
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  // ----- Token Getters -----
  getUserToken(): string | null {
    return localStorage.getItem(this.USER_TOKEN_KEY);
  }

  getAdminToken(): string | null {
    return localStorage.getItem(this.ADMIN_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getUserToken() || !!this.getAdminToken();
  }

  isAdmin(): boolean {
    return localStorage.getItem('role') === 'Admin';
  }

  // ADMIN ID ONLY
  getLoggedInUserId(): number | null {
    const token = this.getAdminToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Decoded Admin Token Payload:', payload);
      return payload.adminId ? Number(payload.adminId) : null;
    } catch (err) {
      console.error('Error decoding admin token:', err);
      return null;
    }
  }

  // USER ID ONLY
  getLoggedInUserOnlyId(): number | null {
    const token = this.getUserToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload['userId'];
      console.log('Decoded User Payload:', payload);
      return userId ? parseInt(userId) : null;
    } catch (error) {
      console.error('Error decoding user token:', error);
      return null;
    }
  }
}

