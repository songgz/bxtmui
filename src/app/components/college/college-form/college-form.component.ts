import { Component, OnInit } from '@angular/core';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
import {NgForm} from '@angular/forms';

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

  save(f: NgForm) {
    if (this.college.id != null) {
      this.update(f);
    } else {
      this.create(f);
    }
  }

  create(f: NgForm) {
    this.rest.create('colleges', {college: f.value}).subscribe((data: any) => {
      this.college = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  edit() {
      this.rest.show('colleges/' + this.college.id).subscribe((data: any) => {
        this.college = data;
      });
  }

  update(f: NgForm) {
    this.rest.update('colleges/' + this.college.id, {college: f.value}).subscribe((data: any) => {
      this.college = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  goBack() {
    this.rest.navigate(['/bxt/colleges']);
  }


}
