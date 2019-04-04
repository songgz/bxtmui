import {AfterViewInit, Component, OnInit, ViewChild, Inject} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {RestService} from '../../services/rest.service';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material';
export interface DialogData {
  dataid: string;
}
@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit, AfterViewInit {
  displayedColumns = [ 'select', 'picture', 'name', 'updated_at', 'action'];
  dataSource: MatTableDataSource<any[]>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  teacher_ids: any[] = [];

  constructor(private rest: RestService, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.paginator.pageSize = 10;
    this.paginator.pageIndex = 0;
    this.loadTeachers();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator.page.subscribe(event => {
      this.loadTeachers();
    });
  }

  loadTeachers() {
    this.rest.index('teachers', {page: this.paginator.pageIndex + 1, pre: this.paginator.pageSize}).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.result);
      this.paginator.length = data.paginate_meta.total_count;
      this.paginator.pageSize = data.paginate_meta.current_per_page;
      this.paginator.pageIndex = data.paginate_meta.current_page - 1;
    }, error => {
      this.rest.errorHandle(error);
    });
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  update (id: string)  {
    this.rest.navigate(['/bxt/teachers/', id, 'edit']);
  }
  delete (id: string) {
    this.rest.confirm({title: '你确定要删除这条数据?'}).afterClosed().subscribe(res => {
      if (res) {
        this.rest.destory('teachers/' + id).subscribe(data => {
          this.loadTeachers();
        }, error => {
          this.rest.errorHandle(error);
        });
      }
    });
  }
  openDialog(id: string) {
    this.dialog.open(ImgDialogteacher, {
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
}
@Component({
  selector: 'ImgDialogteacher',
  templateUrl: './imgdialog.html',
})
export class ImgDialogteacher {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
