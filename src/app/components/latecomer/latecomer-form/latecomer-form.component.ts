import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-latecomer-form',
  templateUrl: './latecomer-form.component.html',
  styleUrls: ['./latecomer-form.component.scss']
})
export class LatecomerFormComponent implements OnInit {
  latecomer: any = {};

  constructor(private rest: RestService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.latecomer.id = params.get('id');
      if (this.latecomer.id != null) {this.edit(); }
    });
  }
s
  edit() {
    this.rest.show('latecomers/' + this.latecomer.id).subscribe((data: any) => {
      this.latecomer = data;
    });
  }

  update(f: NgForm) {
    this.rest.update('latecomers/' + this.latecomer.id, {latecomer: f.value}).subscribe((data: any) => {
      this.latecomer = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  goBack() {
    this.rest.navigate(['/bxt/latecomers']);
  }

}
