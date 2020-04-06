import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {filter, map} from 'rxjs/operators';

export interface BroadcastEvent {
  key: any;
  data?: any;
}

@Injectable()
export class Ng2BroadcasterService {

  private eventBus: Subject<BroadcastEvent>;

  constructor() {
    this.eventBus = new Subject<BroadcastEvent>();
  }

  broadcast(key: any, data?: any) {
    this.eventBus.next({key, data});
  }

  on<T>(key: any): Observable<T> {
    return this.eventBus.asObservable().pipe(
      filter(event => event.key === key)).pipe(
      map(event => <T>event.data)
    );
  }
}
