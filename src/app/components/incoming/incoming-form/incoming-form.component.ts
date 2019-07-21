import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-latecomer-form',
  templateUrl: './incoming-form.component.html',
  styleUrls: ['./incoming-form.component.scss']
})
export class IncomingFormComponent implements OnInit {
  user: any = {};

  constructor(private rest: RestService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.user.id = params.get('id');
      if (this.user.id != null) {this.edit(); }
    });
  }

  edit() {
    this.rest.show('incomings/' + this.user.id).subscribe((data: any) => {
      this.user = data;
    });
  }

  update(f: NgForm) {
    this.rest.update('incomings/' + this.user.id, {user: f.value}).subscribe((data: any) => {
      this.user = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  goBack() {
    this.rest.navigate(['/bxt/incomings']);
  }

}
