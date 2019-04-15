import { Component, OnInit } from '@angular/core';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-webcam-form',
  templateUrl: './webcam-form.component.html',
  styleUrls: ['./webcam-form.component.scss']
})
export class WebcamFormComponent implements OnInit {
  webcam: any = {};
  constructor(private rest: RestService, private route: ActivatedRoute) { }


  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.webcam.id = params.get('id');
      if (this.webcam.id != null) {this.edit(); }
    });
  }

  save() {
    if (this.webcam.id != null) {
      this.update();
    } else {
      this.create();
    }
  }

  create() {
    this.rest.create('webcams', {webcam: this.webcam}).subscribe((data: any) => {
      this.webcam = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  edit() {
    this.rest.show('webcams/' + this.webcam.id).subscribe((data: any) => {
      this.webcam = data;
    });
  }

  update() {
    this.rest.update('webcams/' + this.webcam.id, {webcam: this.webcam}).subscribe((data: any) => {
      this.webcam = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }
  goBack() {
    this.rest.navigate(['/bxt/webcams']);
  }
}
