import {AfterViewInit, Component, OnInit, ViewChild, Inject} from '@angular/core';
import {MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {RestService} from '../../services/rest.service';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {DictService} from '../../services/dict.service';
import {UpfileComponent} from '../upfile/upfile.component';
import {OrgService} from '../../services/org.service';

export interface DialogData {
  dataid: string;
}

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit, AfterViewInit {
  displayedColumns = ['select', 'name', 'sno', 'dept', 'bedroom', 'updated_at', 'action'];
  dataSource: MatTableDataSource<any[]>;
  query: any = {}
  moreserch  = false;
  colleges: Observable<any[]>;
  departments: Observable<any[]>;
  classrooms: Observable<any[]>;

  genders: Observable<any[]>;

  room: any = {id: null, floor_mark: null, parent_id: null};
  houses: Observable<any[]>;
  rooms: Observable<any[]>;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel<any[]>(true, []);
  student_ids: any[] = [];

  constructor(private rest: RestService,
              public dialog: MatDialog,
              private  dict: DictService,
              private snackBar: MatSnackBar,
              private org: OrgService) {
    this.org.getOrgs();
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.paginator.pageSize = 10;
    this.paginator.pageIndex = 0;
    this.loadStudents();
    this.getColleges();
    this.getDepartments();
    this.getClassrooms();
    this.genders = this.dict.getItems('gender_type');
    this.getHouses();
    // this.getRooms();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator.page.subscribe(event => {
      this.loadStudents();
    });
  }

  loadStudents(options = {}) {
    options['page'] = this.paginator.pageIndex + 1;
    options['pre'] = this.paginator.pageSize;
    this.rest.index('students', options).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.result);
      this.paginator.length = data.paginate_meta.total_count;
      this.paginator.pageSize = data.paginate_meta.current_per_page;
      this.paginator.pageIndex = data.paginate_meta.current_page - 1;
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  applyFilter(filterValue: string) {
    this.loadStudents({key: filterValue.trim()});
  }

  update(id: string) {
    this.rest.navigate(['/bxt/students/', id, 'edit']);
  }

  delete(id: string) {
    this.rest.destory('students/' + id).subscribe(data => {
      this.loadStudents();
    }, error => {
      this.rest.errorHandle(error);
    });
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

  // getRooms() {
  //   if (this.student.house_id) {
  //     this.rooms = this.rest.index('rooms', {house_id: this.student.house_id})
  //       .pipe(map((res: any) => res.result));
  //   }
  // }
  //
  // filterRooms() {
  //   this.getRooms();
  //   this.student.room_id = null;
  // }

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

  allDel() {
    if (this.student_ids.length === 0) {
      // console.log(this.teacher_ids);
      this.snackBar.open('请选择数据', '', {
        duration: 2000,
        verticalPosition: 'top',
      });
    } else {
      this.rest.confirm({title: '你确定要删除数据?'}).afterClosed().subscribe(res => {
        if (res) {
          this.student_ids.forEach(row => {
            this.delete(row);
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

  upfile() {
    this.dialog.open(UpfileComponent, {});
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

  serchbtn(obj) {
    console.log(obj);
    this.rest.index('students', {page: this.paginator.pageIndex + 1, pre: this.paginator.pageSize}).subscribe((data: any) => {
      this.dataSource = this.dataSource;
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

@Component({
  selector: 'app-student-imgdialog',
  templateUrl: './imgdialog.html',
})
export class ImgDialogStudentComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }
}
