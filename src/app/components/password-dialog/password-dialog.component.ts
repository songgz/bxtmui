import {Component, Inject, OnInit} from '@angular/core';
import {RestService} from '../../services/rest.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {JwtAuthService} from '../../services/jwt-auth.service';

@Component({
  selector: 'app-password-dialog',
  templateUrl: './password-dialog.component.html',
  styleUrls: ['./password-dialog.component.scss']
})
export class PasswordDialogComponent implements OnInit {
  model: any = {};

  constructor(private rest: RestService, @Inject(MAT_DIALOG_DATA) public data: any, private auth: JwtAuthService) {

  }

  ngOnInit() {

  }

  update() {
    const user_id = this.auth.getCurrentUser().user_id
    this.rest.update('sessions/' + user_id, this.model).subscribe();
  }

}
