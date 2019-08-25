import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {tap} from 'rxjs/internal/operators/tap';
import {CurrentUser} from '../models/current-user';
import {Observable} from 'rxjs';

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
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  register(email: string, password: string) {
    return this.rest.create('users', {}).subscribe((data: any) => {
      this.login(email, password);
    });
  }

  // refresh() {
  //   return this.rest.refresh('refreshs', {'X-Refresh-Token': this.getRefreshToken()}).pipe(
  //     tap((data: any) => {
  //       this.setToken(this.ACCESS_TOKEN, data.access);
  //     })
  //   );
  // }

  refreshToken(): Observable<CurrentUser> {
    const currentUser = this.getCurrentUser();
    const token = currentUser.refresh;

    return this.rest.refresh('refreshs', {'X-Refresh-Token': this.getAuthToken()})
      .pipe(
        map((user: CurrentUser) => {
          if (user && user.access) {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          return <CurrentUser>user;
        }));
  }

  getAuthToken(): string {
    const currentUser = this.getCurrentUser();
    if (currentUser != null) {
      return currentUser.access;
    }
    return '';
  }

  isAuthenticated(): boolean {
    const currentUser = this.getCurrentUser();
    return currentUser && Date.parse(currentUser.access_expires_at).valueOf() >  new Date().valueOf();
  }

}
