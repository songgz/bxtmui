import { Injectable } from '@angular/core';
import {RestService} from './rest.service';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor(private rest: RestService) { }

  login(username: string, password: string) {
    return this.rest.create('sessions', {username: username, password: password}).subscribe((data: any) => {
      localStorage.setItem('access_token', data.access);
    });
  }

  register(email: string, password: string) {
    return this.rest.create('users', {}).subscribe((data: any) => {
      this.login(email, password);
    });
  }

  logout() {
    localStorage.removeItem('access_token');
  }

  public get loggedIn(): boolean{
    return localStorage.getItem('access_token') !==  null;
  }
}
