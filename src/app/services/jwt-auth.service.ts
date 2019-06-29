import { Injectable } from '@angular/core';
import {RestService} from './rest.service';

@Injectable({
  providedIn: 'root'
})
export class JwtAuthService {
  private readonly ACCESS_TOKEN = 'access_token';
  private readonly REFRESH_TOKEN = 'refresh_token';
  private readonly CSRF_TOKEN = 'csrf_token'; // 'X-CSRF-Token';

  constructor(private rest: RestService) { }

  login(username: string, password: string) {
    return this.rest.create('sessions', {username: username, password: password}).subscribe((data: any) => {
      this.setToken(this.ACCESS_TOKEN, data.access);
      this.setToken(this.REFRESH_TOKEN, data.refresh);
      this.setToken(this.CSRF_TOKEN, data.csrf);
    });
  }

  register(email: string, password: string) {
    return this.rest.create('users', {}).subscribe((data: any) => {
      this.login(email, password);
    });
  }

  refresh() {
    return this.rest.refresh('refreshs', {
      // 'X-Refresh-Token': this.getRefreshToken(),
      'X-CSRF-Token': this.getCsrfToken()})
      .subscribe((data: any) => {
        this.setToken(this.ACCESS_TOKEN, data.access);
      // console.log(data);
    });
  }

  logout() {
    this.removeTokens();
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return token != null;
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
  }

  public get loggedIn(): boolean {
    return this.getAccessToken() !==  null;
  }
}
