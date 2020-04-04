import {AfterViewInit, Component, OnInit, ViewChild, Inject} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {RestService} from '../../services/rest.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {SelectionModel} from '@angular/cdk/collections';
import {Observable} from 'rxjs';
import {DictService} from '../../services/dict.service';
import {OrgService} from '../../services/org.service';
import {environment} from '../../../environments/environment';
import {ImportStudentComponent} from '../import-student/import-student.component';
import {ImportAvatarComponent} from '../import-avatar/import-avatar.component';
import {from} from 'rxjs/internal/observable/from';
import {last} from 'rxjs/internal/operators/last';
import {concatMap} from 'rxjs/internal/operators/concatMap';

export interface DialogData {
  dataid: string;
}
export interface ListDialogData {
  list: any;
}

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit, AfterViewInit {
  displayedColumns = ['select', 'name', 'sno', 'dept', 'bedroom', 'updated_at', 'action'];
  dataSource: MatTableDataSource<any[]>;
  query: any = {};
  moreserch  = false;
  genders: Observable<any[]>;
  houses: any[] = [];
  floors: any[] = [];
  rooms: any[] = [];
  house_id = null;
  floor_id = null;
  room_id = null;
  facility_id = null;
  baseUrl: any;

  @ViewChild(MatPaginator, { read: true, static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { read: true, static: false }) sort: MatSort;
  selection = new SelectionModel<any[]>(true, []);
  student_ids: any[] = [];
  pageIndex = 0;
  pageSize = 10;
  pageLength = 0;

  constructor(private rest: RestService,
              public dialog: MatDialog,
              private  dict: DictService,
              private snackBar: MatSnackBar,
              public org: OrgService) {
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  paginate(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.query['page'] =  this.pageIndex + 1;
    this.query['pre'] = this.pageSize;
    this.loadStudents(this.query);
  }

  loadStudents(options = {}) {
    this.rest.index('students', this.query).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.result);
      this.pageLength = data.paginate_meta.total_count;
      this.pageSize = data.paginate_meta.current_per_page;
      this.pageIndex = data.paginate_meta.current_page - 1;
    }, error => {
      this.rest.errorHandle(error);
    });
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
    this.query = JSON.parse(sessionStorage.getItem('student_query')) || this.query;
    sessionStorage.removeItem('house_id');
    sessionStorage.removeItem('floor_id');
    sessionStorage.removeItem('room_id');
    sessionStorage.removeItem('student_query');
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

  update(id: string) {
    this.query.facility_id = this.room_id || this.floor_id || this.house_id;
    this.setSession();
    this.rest.navigate(['/bxt/students/', id, 'edit'], { queryParamsHandling: 'preserve' });
  }

  delete(id: string) {
    this.rest.destory('students/' + id).subscribe(data => {
      this.loadStudents(this.query);
    }, error => {
      this.rest.errorHandle(error);
    });
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
    this.rest.index('floors', options ).subscribe((data: any) => {
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
    this.rest.index('rooms', options ).subscribe((data: any) => {
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

  student_selected(teacher_id) {
    const i = this.student_ids.indexOf(teacher_id);
    if (i > -1) {
      this.student_ids.splice(i, 1);
    } else {
      this.student_ids.push(teacher_id);
    }
  }

  allSelect(e) {
    this.dataSource.data.forEach(row => {
      if (e.checked) {
        if (this.student_ids.indexOf(row['id']) < 0) {
          this.student_ids.push(row['id']);
        }
      } else {
        this.student_ids.splice(this.student_ids.indexOf(row['id']), 1);
      }
    });
  }
  allAdd() {
    console.log('添加人员');
    if (this.student_ids.length === 0) {
      this.snackBar.open('请选择数据', '', {
        duration: 2000,
        verticalPosition: 'top',
      });
    } else {
      this.rest.confirm({title: '你确定要添加数据?'}).afterClosed().subscribe(res => {
        if (res) {
          from(this.student_ids).pipe(concatMap((id: any) => {
            console.log(id);
            return this.rest.create('faces', { face: { user_id: id } });
          })).pipe(last()).subscribe(data => {
            this.loadStudents(this.query);
            this.student_ids = [];
          }, error => {
            this.rest.errorHandle(error);
          });
        }
      });
    }
  }
  allAddDel() {
    console.log('下发删除');
    if (this.student_ids.length === 0) {
      this.snackBar.open('请选择数据', '', {
        duration: 2000,
        verticalPosition: 'top',
      });
    } else {
      this.rest.confirm({title: 'OK?'}).afterClosed().subscribe(res => {
        if (res) {
          from(this.student_ids).pipe(concatMap((id: any) => {
            console.log(id);
            return this.rest.create('faces', {  face: { user_id: id , status: 'delete'}  });
          })).pipe(last()).subscribe(data => {
            this.loadStudents(this.query);
            this.student_ids = [];
          }, error => {
            this.rest.errorHandle(error);
          });
        }
      });
    }
  }

  allDel() {
    if (this.student_ids.length === 0) {
      this.snackBar.open('请选择数据', '', {
        duration: 2000,
        verticalPosition: 'top',
      });
    } else {
      this.rest.confirm({title: '你确定要删除数据?'}).afterClosed().subscribe(res => {
        if (res) {
          from(this.student_ids).pipe(concatMap((id: any) => {
           return this.rest.destory('students/' + id);
          })).pipe(last()).subscribe(data => {
            this.loadStudents(this.query);
            this.student_ids = [];
          }, error => {
            this.rest.errorHandle(error);
          });
        }
      });
    }
  }


  openDialog(id: string) {
    this.dialog.open(ImgDialogStudentComponent, {
      data: {
        dataid: id
      }
    });
  }

  openDialogList(displayedColumns: string[]) {
    this.dialog.open(ListDialogStudentComponent, {
      width: '250px',
      data: { list: displayedColumns }
    });
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  import_student() {
    this.dialog.open(ImportStudentComponent, {});
  }

  import_avatar() {
    this.dialog.open(ImportAvatarComponent, {});
  }
  face() {
    this.rest.index('faces' ).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.result);
    }, error => {
      this.rest.errorHandle(error);
    });
  }
  moreserchbtn() {
    if (this.moreserch === false) {
      this.moreserch = true;
    } else {
      this.moreserch = false;
    }
  }

  serchbtn(e) {
    this.loadStudents(this.query);
  }
}

@Component({
  selector: 'app-student-imgdialog',
  templateUrl: './imgdialog.html',
})
export class ImgDialogStudentComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }
}

@Component({
  selector: 'app-student-listdialog',
  templateUrl: './listdialog.html',
})

export class ListDialogStudentComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ListDialogData) {
  }
  listBtn( str: any) {
    if ( this.data.list.indexOf(str) === -1 ) {
      this.data.list.splice(this.data.list.length - 1, 0, str);
      // console.log( this.data.list);
    } else {
      this.data.list.splice(this.data.list.indexOf(str), 1);
    }
  }
}
