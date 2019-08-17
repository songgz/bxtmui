import {Component, Input, OnInit} from '@angular/core';
import {RestService} from '../../services/rest.service';

@Component({
  selector: 'app-room-box',
  templateUrl: './room-box.component.html',
  styleUrls: ['./room-box.component.scss']
})
export class RoomBoxComponent implements OnInit {
  @Input() room: any;
  gendercolor: boolean = true;
  IO: any;
  constructor( private rest: RestService) { }
  ngOnInit() {
  }
  selfHref(bed: any) {
    this.rest.navigate(['/bxt/accommodations/' + bed.owner_id + '/view']);
  }
}
