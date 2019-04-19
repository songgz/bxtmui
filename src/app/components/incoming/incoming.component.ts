import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {RestService} from '../../services/rest.service';
import {Observable} from 'rxjs';
import {DictService} from '../../services/dict.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-incoming',
  templateUrl: './incoming.component.html',
  styleUrls: ['./incoming.component.scss']
})
export class IncomingComponent implements OnInit, AfterViewInit {
  displayedColumns = [ 'name', 'sno', 'dept_title', 'dorm_title', 'pass_time', 'status', 'overtime', 'reside'];
  dataSource: MatTableDataSource<any[]>;

  moreserch: boolean = false;
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
    gender_mark: null
  };
  colleges: Observable<any[]>;
  departments: Observable<any[]>;
  classrooms: Observable<any[]>;

  genders: Observable<any[]>;

  room: any = {id: null, floor_mark: null, parent_id: null};
  houses: Observable<any[]>;
  rooms: Observable<any[]>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;



  constructor(private rest: RestService, private  dict: DictService) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator.page.subscribe(event => {
      this.loadIncomings();
    });
  }

  ngOnInit() {
    this.paginator.pageSize = 10;
    this.paginator.pageIndex = 0;
    this.loadIncomings();
    this.getColleges();
    this.getDepartments();
    this.getClassrooms();
    this.genders = this.dict.getItems('gender_type');
    this.getHouses();
    this.getRooms();
  }

  loadIncomings(options = {}) {
    this.rest.index('incomings', {page: this.paginator.pageIndex + 1, pre: this.paginator.pageSize}).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.result);
      // 数据转换
      // for ( const i in this.dataSource.filteredData) {
      //   if (this.dataSource.filteredData[i].status_at_last === 'back') {
      //     this.dataSource.filteredData[i].status_at_last = '已归';
      //   } else if ( this.dataSource.filteredData[i].status_at_last === 'back_late') {
      //     this.dataSource.filteredData[i].status_at_last = '晚归';
      //   } else {
      //     this.dataSource.filteredData[i].status_at_last = this.dataSource.filteredData[i].status_at_last;
      //   }
      // }


      this.paginator.length = data.paginate_meta.total_count;
      this.paginator.pageSize = data.paginate_meta.current_per_page;
      this.paginator.pageIndex = data.paginate_meta.current_page - 1;
    }, error => {
      this.rest.errorHandle(error);
    });
  }
  applyFilter(filterValue: string) {
    this.loadIncomings({key: filterValue.trim()});
  }


  getColleges() {
    this.colleges = this.rest.index('colleges').pipe(map((res: any) => res.result));
  }

  getDepartments() {
    this.departments = this.rest.index('departments').pipe(map((res: any) => res.result));
  }

  getClassrooms() {
    this.classrooms = this.rest.index('classrooms').pipe(map((res: any) => res.result));
  }
  // selectCollege() {
  //   this.getDepartments();
  //   this.student.department_id = null;
  // }
  //
  // selectDepartment() {
  //   this.getClassrooms();
  //   this.student.classroom_id = null;
  // }
  getHouses() {
    this.houses = this.rest.index('houses').pipe(map((res: any) => res.result));
  }

  getRooms() {
    if (this.student.house_id) {
      this.rooms = this.rest.index('rooms', {house_id: this.student.house_id})
        .pipe(map((res: any) => res.result));
    }
  }
  filterRooms() {
    this.getRooms();
    this.student.room_id = null;
  }

  moreserchbtn() {
    if (this.moreserch === false) {
      this.moreserch = true;
    } else {
      this.moreserch = false;
    }
  }
  shuchu(v) {
    // console.log(v);
  }
  serchbtn( obj) {
    console.log( obj);
    this.rest.index('students', {page: this.paginator.pageIndex + 1, pre: this.paginator.pageSize}).subscribe((data: any) => {
      // this.dataSource = this.dataSource;
    }, error => {
      this.rest.errorHandle(error);
    });
    if (obj.id == null) {
      this.dataSource = null;
    }
    if (obj.house_id != null) {
      this.rest.index('students', {page: this.paginator.pageIndex + 1, pre: this.paginator.pageSize}).subscribe((data: any) => {
        console.log(data);
      }, error => {
        this.rest.errorHandle(error);
      });
    }
  }

}
