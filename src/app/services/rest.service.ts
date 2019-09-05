import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {AlertDialogComponent} from '../components/message-dialog/alert-dialog.component';
import {ConfirmDialogComponent} from '../components/confirm-dialog/confirm-dialog.component';
import {environment} from '../../environments/environment';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  errorMsg: any;

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient, private router: Router, private location: Location, private dialog: MatDialog) { }

  refresh(path: string, options: {}) {
    return this.http.post(this.baseUrl + path + '.json', {}, {headers: options});
  }

  index (path: string, params = {}) {
    return this.http.get(this.baseUrl + path + '.json', {headers: this.getHttpOptions(), params: params});
  }

  create(path: string, body: any) {
    return this.http.post(this.baseUrl + path + '.json', body, {headers: this.getHttpOptions()});

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

  navigate(path: any[], params = {}) {
    this.router.navigate(path, params);
  }

  goBack() {
    this.location.back();
  }

  errorHandle(error: HttpErrorResponse) {
    console.log(error);
    // this.errorMsg = error.error ? error.error : error.statusText;
    this.errorMsg = error;
    this.router.navigate(['bxt', 'error']);
  }

  // msgDialog({title: data.status}).afterClosed().subscribe(result => {});
  msgDialog(msg: any) {
    return this.dialog.open(AlertDialogComponent, {data: msg});
  }

  confirm(msg: any) {
    return this.dialog.open(ConfirmDialogComponent, {data: msg});
  }

  getHttpOptions() {
    // const token = localStorage.getItem('access_token');
    return {
      // headers: new HttpHeaders({'Content-Type': 'application/json'})
      // 'Authorization': 'Bearer ' + token
    };
  }

}
