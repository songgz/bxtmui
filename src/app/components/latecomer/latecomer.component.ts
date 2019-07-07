import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {RestService} from '../../services/rest.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {DictService} from '../../services/dict.service';
import {OrgService} from '../../services/org.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
// import {SheetService} from "../../services/excel.service";
import {ExcelService} from '../../services/excel.service';
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'app-latecomer',
  templateUrl: './latecomer.component.html',
  styleUrls: ['./latecomer.component.scss']
})
export class LatecomerComponent implements OnInit, AfterViewInit {
  displayedColumns = [ 'user_name', 'user_sno', 'dept_title', 'dorm_title', 'pass_time', 'status',  'overtime', 'action' ];
  dataSource: MatTableDataSource<any[]>;
  @ViewChild(MatPaginator, { read: true, static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { read: true, static: false }) sort: MatSort;
  query: any = {};
  sleep_status: any = {};
  color_status: any = {};
  houses: Observable<any[]>;
  pageIndex = 0;
  pageSize = 10;
  pageLength = 0;

  constructor(private rest: RestService, private  dict: DictService, private org: OrgService, private excel: ExcelService,
              private _snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource([]);
    this.dict.getItems('sleep_status').subscribe(data => {
      for (const item of data) {
        this.sleep_status[item.mark] = item.title;
        this.color_status[item.mark] = item.color;
      }
    });
    this.org.getOrgs();
    this.getHouses();
  }

  ngOnInit() {
    this.loadLatecomers();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  paginate(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadLatecomers();
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

  update (id: string)  {
    this.rest.navigate(['/bxt/latecomers/', id, 'edit']);
  }

  export_excel() {
    this.query['pre'] = 99999
    this.rest.index('latecomers', this.query).subscribe((data: any) => {
      this.excel.to_excel({
        user_name: '姓名',
        user_sno: '学号',
        user_dorm_title: '公寓',
        user_dept_title: '组织',
        pass_time: '时间',
        status: '状态',
        overtime: '超时'},
        data.result, (k: string, d: any) => {
          // if (k === 'pass_time') {return new Date(d[k]).toLocaleString(); }
          if (k === 'status') { return this.sleep_status[d[k]]; }
          return d[k];
        });
    });
  }
  // export_excel() {
  //   if( !this.query.facility_id ) {
  //     this._snackBar.open('请选择楼栋', '', {
  //       duration: 2000,
  //     });
  //   } else {
  //     this.query['pre'] = 9;
  //     this.rest.index('incomings', this.query).subscribe((data: any) => {
  //       const json = data.result.map( function (item) {
  //         if (item.status_at_last == 'back_late'){
  //           item.status_at_last = '晚归';
  //         }else if (item.status_at_last == 'back'){
  //           item.status_at_last = '已归';
  //         }else if (item.status_at_last == 'night_out'){
  //           item.status_at_last = '夜出';
  //         }else if (item.status_at_last == 'go_out'){
  //           item.status_at_last = '未归';
  //         }else  item.status_at_last = '异常';
  //         item.pass_time_at_last = new Date(item.pass_time_at_last).toLocaleString();
  //         return {
  //           '姓名':item.name,
  //           '学号':item.sno,
  //           '状态':item.status_at_last,
  //           '寝室':item.dorm_full_title,
  //           '时间':item.pass_time_at_last
  //         }
  //       });
  //       // console.log(json);
  //
  //       this.sheetService.jsontToSheet(json,  'sheet1' + Date.parse(new Date().toString()) + '.xlsx');
  //     });
  //   }
  // }
}
