import {Component, OnInit, ViewChild} from '@angular/core';
import {RestService} from '../../services/rest.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-setdorm',
  templateUrl: './setdorm.component.html',
  styleUrls: ['./setdorm.component.scss']
})
export class SetdormComponent implements OnInit {
  dict: any = {id: null, dict_items: []};

  public dict_item: any = { title: null, mark: null};

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
    this.dict.dict_items.push( { });
    console.log(this.dict.dict_items);
  }

  ThisDel(i) {
    // this.dict.dict_items.splice(i, 1 );
    // console.log(this.dict.dict_items);
    this.dict.dict_items = this.dict.dict_items.filter() ;
  }
}
