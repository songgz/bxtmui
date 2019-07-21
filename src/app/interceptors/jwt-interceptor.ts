import { Injectable } from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {JwtAuthService} from '../services/jwt-auth.service';
import {tap} from 'rxjs/internal/operators/tap';
import {catchError} from 'rxjs/operators';
import {mergeMap} from 'rxjs/internal/operators/mergeMap';
import {switchMap} from 'rxjs/internal/operators/switchMap';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(public auth: JwtAuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    if (this.auth.isAuthenticated()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.auth.getAccessToken()}`
        }
      });
    }
    return next.handle(request);
  }
}
