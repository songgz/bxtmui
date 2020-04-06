import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Ng2ActionCableService} from '../../services/ng2-action-cable.service';
import {Ng2BroadcasterService} from '../../services/ng2-broadcaster.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers: [Ng2BroadcasterService, Ng2ActionCableService]
})
export class ChatComponent implements OnInit, OnDestroy  {
  subscription: Subscription;
  messages: any[] = [];
  cable: any;

  constructor(private ng2cable: Ng2ActionCableService, private broadcaster: Ng2BroadcasterService) { }

  ngOnInit(): void {
    this.ng2cable.subscribe('http://127.0.0.1:3000/cable', 'ChatChannel', { chat_id: '1' });
    this.broadcaster.on<string>('ChatChannel').subscribe(
      message => {
        this.messages.push(JSON.stringify(message));
        console.log(message);
      }
    );

  }

  send(ms) {
    this.cable = this.ng2cable.actionCable.createConsumer('ws://127.0.0.1:3000/cable');
    this.cable.subscriptions.create('ChatChannel', {
      speak: (data) => {this.cable.perform('speak', data); }
    });
    this.cable.speak('gggg');
  }

  ngOnDestroy() {

  }

}
