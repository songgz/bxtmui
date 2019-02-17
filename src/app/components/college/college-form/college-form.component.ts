import { Component, OnInit } from '@angular/core';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
  selector: 'app-college-form',
  templateUrl: './college-form.component.html',
  styleUrls: ['./college-form.component.scss']
})
export class CollegeFormComponent implements OnInit {
  college: any = {id: null};

  constructor(private rest: RestService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.college.id = params.get('id');
      if (this.college.id != null) {this.edit(); }
    });
  }

  save() {
    if (this.college.id != null) {
      this.update();
    } else {
      this.create();
    }
  }

  create() {
    this.rest.create('colleges', this.college).subscribe((data: any) => {
      this.rest.msgDialog({title: data.status}).afterClosed().subscribe(result => {
        this.college = data;
        this.rest.goBlank();
      });
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  edit() {
      this.rest.show('colleges/' + this.college.id).subscribe((data: any) => {
        this.college = data;
      });
  }

  update() {
    this.rest.update('colleges/' + this.college.id, this.college).subscribe((data: any) => {
      this.rest.msgDialog({title: data.status}).afterClosed().subscribe(result => {
        this.college = data;
        this.rest.goBlank();
      });
    }, error => {
      this.rest.errorHandle(error);
    });
  }


}
