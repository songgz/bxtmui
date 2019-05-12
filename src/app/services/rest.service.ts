import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {MatDialog} from '@angular/material';
import {AlertDialogComponent} from '../components/message-dialog/alert-dialog.component';
import {ConfirmDialogComponent} from '../components/confirm-dialog/confirm-dialog.component';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  errorMsg: any;

  httpOptions = {
    // headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  baseUrl = environment.baseUrl + '/';

  constructor(private http: HttpClient, private router: Router, private dialog: MatDialog) { }

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

}
