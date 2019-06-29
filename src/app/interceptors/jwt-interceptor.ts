import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import {Observable} from 'rxjs';
import {JwtAuthService} from '../services/jwt-auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(public auth: JwtAuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const token = this.auth.getAccessToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'X-CSRF-Token': this.auth.getCsrfToken()
        }
      });
    }

    return next.handle(request);
  }
}
