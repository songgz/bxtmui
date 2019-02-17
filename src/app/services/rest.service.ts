import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {MatDialog} from '@angular/material';
import {MessageDialogComponent} from '../components/message-dialog/message-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  errorMsg: any;

  httpOptions = {
    // headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  baseUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient, private router: Router,  private location: Location, private dialog: MatDialog) { }

  index (path: string, params = {}) {
    return this.http.get(this.baseUrl + path + '.json', {params: params});
  }

  create(path: string, body: any) {
    return this.http.post(this.baseUrl + path + '.json', body);

  }

  update(path: string, body: any) {
    return this.http.put(this.baseUrl + path + '.json', body);
  }

  destory(path: string) {
    return this.http.delete(this.baseUrl + path + '.json');
  }

  show(path: string) {
    return this.http.get(this.baseUrl + path + '.json');
  }

  navigate(path: any[]) {
    this.router.navigate(path);
  }

  errorHandle(error: HttpErrorResponse) {
    this.errorMsg = error.error ? error.error : error.statusText;
    this.router.navigate(['bxt', 'error']);
  }

  msgDialog(msg: any) {
    return this.dialog.open(MessageDialogComponent, msg);
  }

  goBlank() {
    this.location.back();
  }

}
