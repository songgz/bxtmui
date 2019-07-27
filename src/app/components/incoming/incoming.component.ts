import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {RestService} from '../../services/rest.service';
import {Observable} from 'rxjs';
import {DictService} from '../../services/dict.service';
import {map} from 'rxjs/operators';
import {OrgService} from '../../services/org.service';
import { MatDialog } from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ExcelFileService} from '../../services/excel-file.service';
import {ImgDialogStudentComponent} from '../student/student.component';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-incoming',
  templateUrl: './incoming.component.html',
  styleUrls: ['./incoming.component.scss']
})
export class IncomingComponent implements OnInit, AfterViewInit {
  displayedColumns = [ 'name', 'sno', 'dorm_title', 'pass_time', 'status', 'overtime', 'reside', 'action'];
  dataSource: MatTableDataSource<any[]>;
  query: any = {};
  moreserch = false;
  genders: Observable<any[]>;
  houses: Observable<any[]>;
  sleep_status: any = {};
  color_status: any = {};
  status_stats: any = {};
  baseUrl: any;
  enddata: any;
  startdata: any;
  @ViewChild(MatPaginator, { read: true, static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { read: true, static: false }) sort: MatSort;
  pageIndex = 0;
  pageSize = 10;
  pageLength = 0;
  file: ExcelFileService = null;
  progressbar = 0;

  constructor(
    private rest: RestService,
    private  dict: DictService,
    public org: OrgService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar) {
    this.dict.getItems('sleep_status').subscribe(data => {
      for (const item of data) {
        this.sleep_status[item.mark] = item.title;
        this.color_status[item.mark] = item.color;
      }
    });
    this.org.getOrgs();
    this.dataSource = new MatTableDataSource([]);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  paginate(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadIncomings(this.query);
  }

  ngOnInit() {
    this.baseUrl = environment.baseUrl;

    this.loadIncomings();
    this.genders = this.dict.getItems('gender_type');
    this.getHouses();
  }

  loadIncomings(options = {}) {
    options['page'] = this.pageIndex + 1;
    options['pre'] = this.pageSize;
    this.rest.index('incomings', options).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.result);
      this.pageLength = data.paginate_meta.total_count;
      this.pageSize = data.paginate_meta.current_per_page;
      this.pageIndex = data.paginate_meta.current_page - 1;
      this.status_stats = data.status_stats;
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  applyFilter(filterValue: string = '') {
    this.loadIncomings(this.query);
  }

  getHouses() {
    this.houses = this.rest.index('houses').pipe(map((res: any) => res.result));
  }

  moreserchbtn() {
    if (this.moreserch === false) {
      this.moreserch = true;
    } else {
      this.moreserch = false;
    }
  }

  screenData () {
    if (this.query.facility_id == null) {
        this._snackBar.open('请选择楼栋', '', {
          duration: 2000,
        });
    } else if (this.query.start_at == null) {
      this._snackBar.open('请选择开始时间', '', {
        duration: 2000,
      });
    } else if (this.query.end_at == null) {
      this._snackBar.open('请选择结束时间', '', {
        duration: 2000,
      });
    } else {
      this.export_excel();
    }

  }

  async export_excel() {
    this.progressbar = 1;
    this.file = new ExcelFileService(['姓名', '学号', '公寓', '组织', '时间', '状态', '超时', '驻留']);
    this.query['pre'] = 200;
    const len = this.pageLength / 200 ;
    for (let i = 0; i <= len; i++ ) {
      this.query['page'] = i + 1;
      const data1: any = await this.rest.index('incomings', this.query).toPromise();
      data1.result.forEach(d => {
        this.file.addRow([
          d.name,
          d.sno,
          d.dorm_full_title,
          d.dept_full_title,
          new Date(d.pass_time_at_last).toLocaleString(),
          this.sleep_status[d.status_at_last],
          d.overtime_at_last,
          d.reside
        ]);
      });
      this.progressbar = (i + 1) / len * 200;
    }
    this.file.save('sheet1');
  }

  update (id: string)  {
    this.rest.navigate(['/bxt/incomings/', id, 'edit']);
  }

  color_confirmed_at_last( e: any) {
    if (e === 'true') {
      return 'green';
    } else {
      return 'red';
    }
  }
  openDialog(id: string) {
    this.dialog.open(ImgDialogStudentComponent, {
      data: {
        dataid: id
      }
    });
  }
}
