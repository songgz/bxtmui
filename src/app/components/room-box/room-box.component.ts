import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-room-box',
  templateUrl: './room-box.component.html',
  styleUrls: ['./room-box.component.scss']
})
export class RoomBoxComponent implements OnInit {
  @Input() room: any;

  constructor() { }

  ngOnInit() {
  }

}
