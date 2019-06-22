import {AfterViewInit, Component, OnInit, ViewChild, Inject, NgModule} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {RestService} from '../../services/rest.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {UpfileComponent} from '../upfile/upfile.component';
import {environment} from '../../../environments/environment';

export interface DialogData {
  dataid: string;
}
@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit, AfterViewInit {
  displayedColumns = [ 'select', 'name', 'dept', 'updated_at', 'action'];
  dataSource: MatTableDataSource<any[]>;
  @ViewChild(MatPaginator, { read: true, static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { read: true, static: false }) sort: MatSort;
  teacher_ids: any[] = [];
  baseUrl: any;
  query: any = {};
  imgsrc: any = '/assets/img/imghead.png';
  pageIndex = 0;
  pageSize = 10;
  pageLength = 0;

  constructor(private rest: RestService, public dialog: MatDialog, private snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.baseUrl = environment.baseUrl;
    this.loadTeachers();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  paginate(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTeachers(this.query);
  }

  loadTeachers(options = {}) {
    options['page'] = this.pageIndex + 1;
    options['pre'] = this.pageSize;
    this.rest.index('teachers', options).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.result);
      this.pageLength = data.paginate_meta.total_count;
      this.pageSize = data.paginate_meta.current_per_page;
      this.pageIndex = data.paginate_meta.current_page - 1;
    }, error => {
      this.rest.errorHandle(error);
    });
  }
  applyFilter(filterValue: string) {
    this.loadTeachers({key: filterValue.trim()});
  }

  update (id: string)  {
    this.rest.navigate(['/bxt/teachers/', id, 'edit']);
  }

  delete (id: string) {
    this.rest.destory('teachers/' + id).subscribe(data => {
      this.loadTeachers();
    }, error => {
      this.rest.errorHandle(error);
    });
  }
  openDialog(id: string) {
    this.dialog.open(ImgDialogTeacherComponent, {
      data: {
        dataid: id
      }
    });
  }

  teacher_selected(teacher_id) {
    const i = this.teacher_ids.indexOf(teacher_id);
    if (i > -1) {
      this.teacher_ids.splice(i, 1);
    } else {
      this.teacher_ids.push(teacher_id);
    }
  }

  allSelect(e) {
    this.dataSource.data.forEach(row => {
      if (e.checked) {
        if (this.teacher_ids.indexOf(row['id']) < 0) {
          this.teacher_ids.push(row['id']);
        }
      } else {
        this.teacher_ids.splice(this.teacher_ids.indexOf(row['id']), 1);
      }
    });
  }
  allDel() {
    if ( this.teacher_ids.length === 0) {
      // console.log(this.teacher_ids);
      this.snackBar.open('请选择数据', '', {
        duration: 2000,
        verticalPosition: 'top',
      });
    } else {
      this.rest.confirm({title: '你确定要删除数据?'}).afterClosed().subscribe(res => {
        if (res) {
          this.teacher_ids.forEach(row => {
            this.delete(row);
          });
        }
      });
    }
  }
  upfile() {
    this.dialog.open(UpfileComponent, { });
  }
}
@Component({
  selector: 'app-teacher-imgdialog',
  templateUrl: './imgdialog.html',
})
export class ImgDialogTeacherComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }
}
