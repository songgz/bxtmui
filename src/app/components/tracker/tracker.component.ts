import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {RestService} from '../../services/rest.service';
import {DictService} from '../../services/dict.service';
import {Observable} from 'rxjs';
import {OrgService} from '../../services/org.service';
import {map} from 'rxjs/operators';
import {ImgDialogStudentComponent} from "../student/student.component";
import { MatDialog } from '@angular/material/dialog';
import {environment} from '../../../environments/environment';
import {ExcelFileService} from '../../services/excel-file.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.scss']
})
export class TrackerComponent implements OnInit, AfterViewInit {
  // displayedColumns = [ 'name', 'sno',  'dorm', 'pass_time', 'direction', 'status', 'overtime',  'snap'];
  displayedColumns = [ 'name', 'sno',  'dorm', 'pass_time', 'direction', 'snap'];
  dataSource: MatTableDataSource<any[]>;
  sleep_status: any = {};
  direction_type: any = {};
  color_status: any = {};
  color_direction: any = {};
  query: any = {};
  moreserch = false;
  houses: Observable<any[]>;
  accesses = [];
  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { read: true }) sort: MatSort;
  pageIndex = 0;
  pageSize = 10;
  pageLength = 0;
  baseUrl: any;
  progressbar = 0;
  file: ExcelFileService = null;

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
    this.dict.getItems('direction_type').subscribe(data => {
      for (const item of data) {
        this.direction_type[item.mark] = item.title;
        this.color_direction[item.mark] = item.color;
      }
      // console.log(this.direction_type);
      // console.log(this.color_direction);
    });
    this.org.getOrgs();
    this.getHouses();
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.baseUrl = environment.baseUrl;
    // this.loadTrackers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  paginate(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTrackers(this.query);
  }

  loadTrackers(options = {}) {
    options['page'] = this.pageIndex + 1;
    options['pre'] = this.pageSize;
    this.rest.index('trackers', options).subscribe((data: any) => {
      // 门禁重命名
      // data.result.forEach( trackersData => {
      //   trackersData.access_title = this.accesses.find( item => item.id === trackersData.access_id).title;
      // });
      // console.log( data.result)

      this.dataSource = new MatTableDataSource(data.result);
      this.pageLength = data.paginate_meta.total_count;
      this.pageSize = data.paginate_meta.current_per_page;
      this.pageIndex = data.paginate_meta.current_page - 1;
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  applyFilter() {
    this.loadTrackers(this.query);
  }
  // getAccesses(options = {}) {
  //   options['pre'] = 9999;
  //   this.rest.index('accesses', options).subscribe((data: any) => {
  //     this.accesses =  data.result;
  //   }, error => {
  //   this.rest.errorHandle(error);
  //   });
  // }

  getHouses() {
    this.houses = this.rest.index('houses').pipe(map((res: any) => res.result));
  }
  openDialog(id: string) {
    // console.log(id)
    this.dialog.open(ImgDialogStudentComponent, {
      data: {
        dataid: id
      }
    });
  }

  screenData () {
    if (this.query.access_id == null) {
      this._snackBar.open('请选择楼栋', '', {
        duration: 2000,
      });
    } else {
      this.export_excel();
    }
  }
  async export_excel() {
    this.progressbar = 1;
    this.file = new ExcelFileService(['姓名', '学号', '公寓', '进出时间', '进/出']);
    this.query['pre'] = 200;
    const len = this.pageLength / 200 ;
    for (let i = 0; i <= len; i++ ) {
      this.query['page'] = i + 1;
      const data1: any = await this.rest.index('trackers', this.query).toPromise();
      data1.result.forEach(d => {
        this.file.addRow([
          d.user_name,
          d.user_sno,
          d.user_dorm_title,
          // d.pass_time,
          // d.status,
          new Date(d.pass_time).toLocaleString(),
          this.direction_type[d.direction]
        ]);
      });
      this.progressbar = (i + 1) / len * 200;
    }
    this.file.save('出入记录');
  }
}
