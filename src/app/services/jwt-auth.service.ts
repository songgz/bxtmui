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
  private readonly ACCESS_TOKEN = 'access_token';
  private readonly REFRESH_TOKEN = 'refresh_token';
  private readonly CSRF_TOKEN = 'csrf_token';
  private readonly ACCESS_EXPIRES = 'access_expires';
  private $window: any;

  // 'X-CSRF-Token';

  constructor(private rest: RestService, private router: Router) { }

  login(username: string, password: string): Observable<CurrentUser> {
    return this.rest.create('sessions', {username: username, password: password})
      .pipe(
        map((user: CurrentUser) => {
          if (user && user.access) {
            const helper = new JwtHelperService();
            const decodedToken = helper.decodeToken(user.access);
            user.user_id = decodedToken.user_id;
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          return <CurrentUser>user;
        }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }


  login1(username: string, password: string) {
    return this.rest.create('sessions', {username: username, password: password}).subscribe((data: any) => {

      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(data.access);
      localStorage.setItem('user_id', decodedToken.user_id);
      localStorage.setItem(this.ACCESS_EXPIRES, data.access_expires_at);
      this.setToken(this.ACCESS_TOKEN, data.access);
      this.setToken(this.REFRESH_TOKEN, data.refresh);
      this.setToken(this.CSRF_TOKEN, data.csrf);
      this.router.navigate(['/bxt']);
    }, error => {
      alert('错误代码：' + error.status);
    });
  }

  register(email: string, password: string) {
    return this.rest.create('users', {}).subscribe((data: any) => {
      this.login(email, password);
    });
  }

  refresh() {
    return this.rest.refresh('refreshs', {'X-Refresh-Token': this.getRefreshToken()}).pipe(
      tap((data: any) => {
        this.setToken(this.ACCESS_TOKEN, data.access);
      })
    );
  }

  refreshToken(): Observable<CurrentUser> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser.refreshToken;

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
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser != null) {
      return currentUser.access;
    }
    return '';
  }

  logout1() {
    this.removeTokens();
  }

  isAuthenticated(): boolean {
    // console.log(Date.parse(localStorage.getItem(this.ACCESS_EXPIRES)));
    return this.getAccessToken() && Date.parse(localStorage.getItem(this.ACCESS_EXPIRES)).valueOf() >  new Date().valueOf();
  }

  getAccessToken() {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  getCsrfToken() {
    return localStorage.getItem(this.CSRF_TOKEN);
  }

  private setToken(key: string, token: string) {
    localStorage.setItem(key, token);
  }

  private removeTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    localStorage.removeItem(this.CSRF_TOKEN);
    localStorage.removeItem(this.ACCESS_EXPIRES);
    localStorage.removeItem('user_id');
  }

  public relogin() {
    this.router.navigate(['/login']);
  }
}
