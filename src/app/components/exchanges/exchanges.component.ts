import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {RestService} from '../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';
import {OrgService} from '../../services/org.service';

@Component({
  selector: 'app-exchanges',
  templateUrl: './exchanges.component.html',
  styleUrls: ['./exchanges.component.scss']
})
export class ExchangesComponent implements OnInit {
  toppings = new FormControl();
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  public username: any = '';
  public list: any = [];
  studentstest: any = [];
  bedstest = [];


  colleges: Observable<any[]>;
  departments: Observable<any[]>;
  classrooms: Observable<any[]>;
  query1: any = {};
  query2: any = {};

  houses: Observable<any[]>;
  constructor(private rest: RestService,
              private route: ActivatedRoute,
              private org: OrgService) {
    this.org.getOrgs();
  }

  ngOnInit() {
    this.getHouses();
  }
  getHouses() {
    this.houses = this.rest.index('houses').pipe(map((res: any) => res.result));
  }
  changeData(bbb) {   /*改变状态*/
    if (this.list[bbb].status === 2 ) {
      this.list[bbb].status = 1;
    } else {
      this.list[bbb].status = 2;
    }
  }
  pushData( data: any) {
    if (this.studentstest.length <= this.bedstest.length) {
      for ( const i in data) {
        console.log(i);
        this.list[i] = Object.assign(this.studentstest[i], this.bedstest[i]);
      }
      console.log(this.list);
    } else {
      alert('学生数不能大于床数');
    }
  }
  SearchBtn1(options = {}) {
    this.rest.index('students', options).subscribe((data: any) => {
      this.studentstest = data.result;
      console.log(data);
    }, error => {
      this.rest.errorHandle(error);
    });
  }
  SearchBtn2(options = {}) {
    this.bedstest = [{title: '1号床', bedid: '1', status: 0}, {title: '2号床', bedid: '2', status: 0}, {title: '3号床', bedid: '3', status: 0}];
  }

  deleteData(i) {
    this.studentstest.splice(i, 1);   /*删除数组的数据*/
  }
  deleteData2(i) {
    this.bedstest.splice(i, 1);   /*删除数组的数据*/
  }
  deleteData3(i) {
    this.list.splice(i, 1);   /*删除数组的数据*/
  }

  applyFilter1(filterValue: string = '') {
    filterValue = filterValue.trim();
    if (filterValue.length !== 0) {
      this.query1['key'] = filterValue;
    }
    this.SearchBtn1(this.query1);
  }
  applyFilter2(filterValue: string = '') {
    filterValue = filterValue.trim();
    if (filterValue.length !== 0) {
      this.query2['key'] = filterValue;
    }
    this.SearchBtn2(this.query2);
  }
}
