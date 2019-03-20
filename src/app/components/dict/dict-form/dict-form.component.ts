import {Component, OnInit, ViewChild} from '@angular/core';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
// import any = jasmine.any;

@Component({
  selector: 'app-dict-form',
  templateUrl: './dict-form.component.html',
  styleUrls: ['./dict-form.component.scss']
})
export class DictFormComponent implements OnInit {
  dict: any = {id: null, dict_items: []};
  new: any = {};
  constructor(private rest: RestService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.dict.id = params.get('id');
      if (this.dict.id != null) {this.edit(); }
    });

  }

  save() {
    if (this.dict.id != null) {
      this.update();
    } else {
      this.create();
    }
  }

  create() {
    this.rest.create('dicts', {dict: this.dict}).subscribe((data: any) => {
      this.dict = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  edit() {
    this.rest.show('dicts/' + this.dict.id).subscribe((data: any) => {
      this.dict = data;
    });

  }

  update() {
    this.rest.update('dicts/' + this.dict.id, {dict: this.dict}).subscribe((data: any) => {
      this.dict = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }


  goBack() {
    this.rest.navigate(['/bxt/dicts']);
  }

  newadd() {
   this.new = { title: null, mark: null};
    this.dict.dict_items.push(this.new);
    // console.log(this.dict.dict_items);
    // this.dict.dict_items = this.dict.dict_items.concat(this.new);

  }


  ThisDel(i) {
  this.dict.dict_items.splice(i, 1 );
  }

}
