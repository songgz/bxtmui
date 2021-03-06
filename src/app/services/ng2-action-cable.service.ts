import { Injectable } from '@angular/core';
import * as ActionCable from 'actioncable';
import {Ng2BroadcasterService} from './ng2-broadcaster.service';

@Injectable()
export class Ng2ActionCableService {

  public cable: any;
  public subscription: any;
  public actionCable = ActionCable;

  constructor(private broadcaster: Ng2BroadcasterService) {
  }

  subscribe(url: string, channel: string, params = {}) {
    this.cable = ActionCable.createConsumer(url);
    this.subscription = this.cable.subscriptions.create(channel, {
      received: (data: any) => {
        console.log(data);
        this.broadcaster.broadcast((data.action || channel), data);
      }
    });
  }

  setCable(url: string): void {
    this.cable = ActionCable.createConsumer(url);
  }

  unsubscribe() {
    this.cable.subscriptions.remove(this.subscription);
  }
}
