import {AfterViewInit, Component, OnInit, ViewChild, Inject} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {RestService} from '../../services/rest.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {SelectionModel} from '@angular/cdk/collections';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {DictService} from '../../services/dict.service';
import {UpfileComponent} from '../upfile/upfile.component';
import {OrgService} from '../../services/org.service';
import {environment} from '../../../environments/environment';

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
  houses: Observable<any[]>;
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
    this.loadStudents();
    this.genders = this.dict.getItems('gender_type');
    this.getHouses();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  paginate(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadStudents(this.query);
  }

  loadStudents(options = {}) {
    options['page'] = this.pageIndex + 1;
    options['pre'] = this.pageSize;
    this.rest.index('students', options).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.result);
      this.pageLength = data.paginate_meta.total_count;
      this.pageSize = data.paginate_meta.current_per_page;
      this.pageIndex = data.paginate_meta.current_page - 1;
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  applyFilter(filterValue: string = '') {
    filterValue = filterValue.trim();
    if (filterValue.length !== 0) {
      this.query['key'] = filterValue;
    }
    this.loadStudents(this.query);
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

  getHouses() {
    this.houses = this.rest.index('houses').pipe(map((res: any) => res.result));
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
      console.log( this.data.list);
    } else {
      this.data.list.splice(this.data.list.indexOf(str), 1);
    }
  }
}
