import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {RestService} from '../../services/rest.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {DictService} from '../../services/dict.service';
import {OrgService} from '../../services/org.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ExcelFileService} from '../../services/excel-file.service';
@Component({
  selector: 'app-latecomer',
  templateUrl: './latecomer.component.html',
  styleUrls: ['./latecomer.component.scss']
})
export class LatecomerComponent implements OnInit, AfterViewInit {
  displayedColumns = [ 'user_name', 'user_sno', 'dept_title', 'dorm_title', 'pass_time', 'direction', 'status',  'overtime', 'reside'];
  dataSource: MatTableDataSource<any[]>;
  @ViewChild(MatPaginator, { read: true, static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { read: true, static: false }) sort: MatSort;
  query: any = {};
  sleep_status: any = {};
  direction_type: any = {};
  color_status: any = {};
  color_direction: any = {};
  houses: Observable<any[]>;
  pageIndex = 0;
  pageSize = 10;
  pageLength = 0;
  file: ExcelFileService = null;
  progressbar: number;
  constructor(private rest: RestService, private  dict: DictService, public org: OrgService,
              private _snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource([]);
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
    });
    this.org.getOrgs();
    this.getHouses();
  }

  ngOnInit() {
    this.loadLatecomers(this.query);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  paginate(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadLatecomers(this.query);
  }
  applyFilter() {
    this.loadLatecomers(this.query);
  }

  getHouses() {
    this.houses = this.rest.index('houses').pipe(map((res: any) => res.result));
  }

  loadLatecomers(options = {}) {
    options['page'] = this.pageIndex + 1;
    options['pre'] = this.pageSize;
    this.rest.index('latecomers', options).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.result);
      this.pageLength = data.paginate_meta.total_count;
      this.pageSize = data.paginate_meta.current_per_page;
      this.pageIndex = data.paginate_meta.current_page - 1;
    });
  }



  async export_excel() {
    this.progressbar = 1;
    this.file = new ExcelFileService(['姓名', '学号', '公寓', '组织', '时间', '状态', '超时', '确认']);
    this.query['pre'] = 100;
    const len = this.pageLength / 100 ;
    for (let i = 0; i <= len; i++ ) {
      this.query['page'] = i + 1;
      const data1: any = await this.rest.index('latecomers', this.query).toPromise();
      data1.result.forEach(d => {
        if (d.confirmed) {
          d.confirmed = d.cause;
        } else {
          d.confirmed = '未确认';
        }
        this.file.addRow([
          d.user_name,
          d.user_sno,
          d.user_dorm_title,
          d.user_dept_title,
          new Date(d.pass_time).toLocaleString(),
          this.sleep_status[d.status],
          d.overtime,
          d.confirmed
        ]);
      });
      this.progressbar = (i + 1) / len * 100;
    }
    this.file.save('sheet1');
  }
}
