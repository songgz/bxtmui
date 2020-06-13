import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  Inject,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RestService } from '../../services/rest.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { DictService } from '../../services/dict.service';
import { OrgService } from '../../services/org.service';
import { environment } from '../../../environments/environment';
import { ImportStudentComponent } from '../import-student/import-student.component';
import { ImportAvatarComponent } from '../import-avatar/import-avatar.component';
import { from } from 'rxjs/internal/observable/from';
import { last } from 'rxjs/internal/operators/last';
import { concatMap } from 'rxjs/internal/operators/concatMap';

@Component({
  selector: 'app-special',
  templateUrl: './special.component.html',
  styleUrls: ['./special.component.scss'],
})
export class SpecialComponent implements OnInit {
  displayedColumns = [
    'name',
    'sno',
    'dept',
    'bedroom',
    'updated_at',
    'action',
  ];
  dataSource: MatTableDataSource<any[]>;
  query: any = {};
  moreserch = false;
  genders: Observable<any[]>;
  houses: any[] = [];
  floors: any[] = [];
  rooms: any[] = [];
  house_id = null;
  floor_id = null;
  room_id = null;
  facility_id = null;
  baseUrl: any;

  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { read: true }) sort: MatSort;
  selection = new SelectionModel<any[]>(true, []);
  student_ids: any[] = [];
  student_cards: any[] = [];
  pageIndex = 0;
  pageSize = 10;
  pageLength = 0;
  constructor(
    private rest: RestService,
    public dialog: MatDialog,
    private dict: DictService,
    private snackBar: MatSnackBar,
    public org: OrgService
  ) {
    this.org.getOrgs();
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.baseUrl = environment.baseUrl;
    this.getSession();
    this.getHouses();
    this.genders = this.dict.getItems('gender_type');
    if (this.query.facility_id) {
      this.loadStudents(this.query);
    }
  }

  paginate(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.query['page'] = this.pageIndex + 1;
    this.query['pre'] = this.pageSize;
    this.loadStudents(this.query);
  }

  loadStudents(options = {}) {
    this.rest.index('students', this.query).subscribe(
      (data: any) => {
        this.dataSource = new MatTableDataSource(data.result);
        // console.log(this.dataSource);
        this.pageLength = data.paginate_meta.total_count;
        this.pageSize = data.paginate_meta.current_per_page;
        this.pageIndex = data.paginate_meta.current_page - 1;
      },
      (error) => {
        this.rest.errorHandle(error);
      }
    );
  }

  applyFilter(filterValue: any) {
    if (filterValue.length > 0) {
      filterValue = filterValue.target.value.trim();
      this.query['key'] = filterValue;
    }
    this.loadStudents(this.query);
  }

  getSession() {
    this.house_id = sessionStorage.getItem('house_id');
    this.floor_id = sessionStorage.getItem('floor_id');
    this.room_id = sessionStorage.getItem('room_id');
    this.query =
      JSON.parse(sessionStorage.getItem('student_query')) || this.query;
    sessionStorage.removeItem('house_id');
    sessionStorage.removeItem('floor_id');
    sessionStorage.removeItem('room_id');
    sessionStorage.removeItem('student_query');
  }
  update(id: string) {
    this.query.facility_id = this.room_id || this.floor_id || this.house_id;
    this.setSession();
    this.rest.navigate(['/bxt/special/', id, 'edit'], {
      queryParamsHandling: 'preserve',
    });
  }

  delete(id: string) {
    this.rest.destory('students/' + id).subscribe(
      (data) => {
        this.loadStudents(this.query);
      },
      (error) => {
        this.rest.errorHandle(error);
      }
    );
  }

  getHouses() {
    this.rest.index('houses').subscribe((data: any) => {
      this.houses = data.result;
      if (this.houses.length > 0) {
        this.house_id = this.house_id || this.houses[0].id;
        this.getFloors();
        if (this.query.facility_id == null) {
          this.query.facility_id = this.house_id;
          this.loadStudents(this.query);
        }
      }
    });
  }

  getFloors() {
    const options = {};
    options['pre'] = 999;
    options['parent_id'] = this.house_id;
    this.rest.index('floors', options).subscribe((data: any) => {
      this.floors = data.result;
      if (this.floors.length > 0 && this.floor_id) {
        this.getRooms();
      }
    });
  }

  getRooms() {
    const options = {};
    options['pre'] = 9999;
    options['parent_id'] = this.floor_id;
    this.rest.index('rooms', options).subscribe((data: any) => {
      this.rooms = data.result;
    });
  }

  changeHouse() {
    this.query['page'] = 1;
    this.query.facility_id = this.house_id;
    this.loadStudents(this.query);
    this.getFloors();
    this.floor_id = null;
    this.room_id = null;
    this.rooms = [];
  }

  changeFloor() {
    this.query['page'] = 1;
    this.query.facility_id = this.floor_id;
    this.loadStudents(this.query);
    this.getRooms();
    this.room_id = null;
  }

  changeRoom() {
    this.query['page'] = 1;
    this.query.facility_id = this.room_id;
    this.loadStudents(this.query);
  }
  serchbtn(e) {
    this.loadStudents(this.query);
  }
  setSession() {
    if (this.house_id) {
      sessionStorage.setItem('house_id', this.house_id);
    }
    if (this.floor_id) {
      sessionStorage.setItem('floor_id', this.floor_id);
    }
    if (this.room_id) {
      sessionStorage.setItem('room_id', this.room_id);
    }
    sessionStorage.setItem('student_query', JSON.stringify(this.query));
  }
}
