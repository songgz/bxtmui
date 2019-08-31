import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import {catchError, map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {CurrentUser} from '../models/current-user';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JwtAuthService {
  // 'X-CSRF-Token';

  constructor(private rest: RestService, private router: Router) { }

  login(username: string, password: string): Observable<CurrentUser> {
    return this.rest.create('sessions', {username: username, password: password})
      .pipe(
        map((user: CurrentUser) => {
          if (user && user.access) {
            this.setCurrentUser(user);
          }
          return <CurrentUser>user;
        }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  getCurrentUser(): CurrentUser {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  setCurrentUser(user: CurrentUser) {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(user.access);
    user.user_id = decodedToken.user_id;
    if (user.refresh) {
      localStorage.setItem('refreshToken', JSON.stringify({refresh: user.refresh, refresh_expires_at: user.refresh_expires_at}));
    }
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  register(email: string, password: string) {
    return this.rest.create('users', {}).subscribe((data: any) => {
      this.login(email, password);
    });
  }

  refreshToken(): Observable<CurrentUser> {
    const token = this.getRefreshToken();

    return this.rest.refresh('refreshs', {'X-Refresh-Token': token.refresh})
      .pipe(
        map((user: CurrentUser) => {
          if (user && user.access) {
            this.setCurrentUser(user);
          }
          return <CurrentUser>user;
        }),
        catchError(err => {
          return throwError(err);
        })
      );
  }

  getAuthToken(): string {
    const currentUser = this.getCurrentUser();
    if (currentUser != null) {
      return currentUser.access;
    }
    return '';
  }

  getRefreshToken(): any {
    return JSON.parse(localStorage.getItem('refreshToken'));
  }

  isAuthenticated(): boolean {
    const currentUser = this.getCurrentUser();
    return currentUser && Date.parse(currentUser.access_expires_at).valueOf() >  new Date().valueOf();
  }

}
