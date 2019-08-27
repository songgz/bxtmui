import { Injectable } from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {JwtAuthService} from '../services/jwt-auth.service';
import {catchError, filter, finalize, take} from 'rxjs/operators';
import {switchMap} from 'rxjs/internal/operators/switchMap';
import {CurrentUser} from '../models/current-user';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(public auth: JwtAuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(this.addTokenToRequest(request, this.auth.getAuthToken()))
      .pipe(
        catchError(err => {
          if (err instanceof HttpErrorResponse) {
            switch ((<HttpErrorResponse>err).status) {
              case 401:
                return this.handle401Error(request, next);
              case 400:
                return throwError(err);
            }
          } else {
            return throwError(err);
          }
        }));
  }

  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({ setHeaders: { Authorization: `Bearer ${token}`}});
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {

    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.tokenSubject.next(null);

      return this.auth.refreshToken()
        .pipe(
          switchMap((user: CurrentUser) => {
            if (user) {
              this.tokenSubject.next(user.access);;
              this.auth.setCurrentUser(user);
              return next.handle(this.addTokenToRequest(request, user.access));
            }
          }),
          catchError(err => {
            return throwError(err);
          }),
          finalize(() => {
            this.isRefreshingToken = false;
          })
        );
    } else {
      this.isRefreshingToken = false;

      return this.tokenSubject
        .pipe(filter(token => token != null),
          take(1),
          switchMap(token => {
            return next.handle(this.addTokenToRequest(request, token));
          }));
    }
  }
}
