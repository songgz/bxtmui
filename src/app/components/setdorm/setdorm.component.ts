import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {RestService} from '../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-setdorm',
  templateUrl: './setdorm.component.html',
  styleUrls: ['./setdorm.component.scss']
})
export class SetdormComponent implements OnInit {
  toppings = new FormControl();
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  public username: any = '';
  public list: any = [];
  studentstest = [];
  bedstest = [];

  student: any = {
    id: null,
    org_id: null,
    college: {id: null},
    department: {id: null},
    classroom: {id: null},
    room: {id: null},
    house: {id: null},
    facility_id: null,
    tel: null,
    id_card: null,
    ic_card: null,
    gender_mark: null,
    nationality: null
  };
  colleges: Observable<any[]>;
  departments: Observable<any[]>;
  classrooms: Observable<any[]>;

  constructor(private rest: RestService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getColleges();
    this.getDepartments();
    this.getClassrooms();
  }

  getColleges() {
    this.colleges = this.rest.index('colleges').pipe(map((res: any) => res.result));
  }

  getDepartments() {
    if (this.student.college_id) {
      this.departments = this.rest.index('departments', {college_id: this.student.college_id})
        .pipe(map((res: any) => res.result));
    }
  }

  getClassrooms() {
    if (this.student.department_id) {
      this.classrooms = this.rest.index('classrooms', {department_id: this.student.department_id})
        .pipe(map((res: any) => res.result));
    }
  }
  selectCollege() {
    this.getDepartments();
    this.student.department_id = null;
  }

  selectDepartment() {
    this.getClassrooms();
    this.student.classroom_id = null;
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
  SearchBtn1() {
    this.studentstest = [
      {name: '学生1' , id: '学生ID1', status: 0},
      {name: '学生2' , id: '学生ID2', status: 0},
      {name: '学生3' , id: '学生ID3', status: 0}
      ];
  }
  SearchBtn2() {
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

  moreserchbtn() {

  }
}
