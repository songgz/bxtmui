import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  httpOptions = {
    //headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  baseUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) { }

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

}
