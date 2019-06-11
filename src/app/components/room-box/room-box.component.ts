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
  constructor( private rest: RestService) { }
  ngOnInit() {
    // if(this.bed.tilte == 0 ){
    //   this.bedcolor = 'primary';
    // }
  }
  selfHref(bed: any) {
    this.rest.navigate(['/bxt/students/'+ bed.owner_id + '/edit']);
  }
}
