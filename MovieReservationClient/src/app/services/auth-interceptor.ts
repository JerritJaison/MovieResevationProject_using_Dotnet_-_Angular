import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  let token: string | null = null;

  // Decide which token to use based on request URL
  if (req.url.includes('/api/Admin')) {
    token = this.auth.getAdminToken();
  } else if (req.url.includes('/api/User')) {
    token = this.auth.getUserToken();
  }

  if (token) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next.handle(authReq);
  }

  return next.handle(req);
}

}
