import { Component, OnInit } from '@angular/core';
import {RestService} from '../../services/rest.service';

@Component({
  selector: 'app-password-dialog',
  templateUrl: './password-dialog.component.html',
  styleUrls: ['./password-dialog.component.scss']
})
export class PasswordDialogComponent implements OnInit {
  data: any = {};
  user_id = '';

  constructor(private rest: RestService) {
    this.user_id = localStorage.getItem('user_id');
  }

  ngOnInit() {

  }

  update() {
    this.rest.update('sessions/' + this.user_id, this.data).subscribe();
  }

}
