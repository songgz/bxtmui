import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {RestService} from '../../services/rest.service';
import {Observable} from 'rxjs';
import {DictService} from '../../services/dict.service';
import {map} from 'rxjs/operators';
import {OrgService} from '../../services/org.service';
import {DialogData, ImgDialogStudentComponent} from "../student/student.component";
import { MatDialog } from '@angular/material/dialog';
// import { saveAs } from 'file-saver';
import { SheetService} from "../../services/excel.service";
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-incoming',
  templateUrl: './incoming.component.html',
  styleUrls: ['./incoming.component.scss']
})
export class IncomingComponent implements OnInit, AfterViewInit {
  // displayedColumns = [ 'name', 'sno', 'dept_title', 'dorm_title', 'pass_time', 'status', 'overtime', 'reside'];
  displayedColumns = [ 'name', 'sno', 'dorm_title', 'pass_time', 'status', 'overtime', 'reside', 'snap'];
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

  constructor(
    private rest: RestService,
    private  dict: DictService,
    private org: OrgService,
    public dialog: MatDialog,
    private sheetService: SheetService,
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
  openDialog(id: string) {
    // console.log(id)
    this.dialog.open(ImgDialogStudentComponent, {
      data: {
        dataid: id
      }
    });
  }
  // export_excel() {
  //   // const file = new File([document.getElementById('export_excel').innerHTML], "数据表.xls", {type: "text/plain;charset=utf-8"});
  //   // alert(file);
  //   // saveAs(file);
  //   const tempData:any = document.getElementById('export_excel').getElementsByTagName( 'tr');
  //   for (let item of tempData) {
  //     item.cells[0].remove();
  //   }
  //   const blob:any = new Blob([ document.getElementById('export_excel').innerHTML ], {
  //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
  //   });
  //   saveAs(blob, '数据表.xls');
  //   this.loadIncomings(this.query);
  // }
  // export_excel() {
  //   this.query['pre'] = 99999;
  //   this.rest.index('incomings', this.query).subscribe((data: any) => {
  //     this.excel.to_excel(
  //       {
  //         user_name: '姓名',
  //         user_sno: '学号',
  //         user_dorm_title: '公寓',
  //         user_dept_title: '组织',
  //         pass_time: '时间',
  //         status: '状态',
  //         overtime: '超时'},
  //       data.result ,
  //       (k: string, d: any) => {
  //         // if (k === 'pass_time') {return new Date(d[k]).toLocaleString(); }
  //         if (k === 'status') { return this.status_stats[d[k]]; }
  //         return d[k];
  //       });
  //
  //   });
  // }
  export_excel() {
    if( !this.query.facility_id ) {
      this._snackBar.open('请选择楼栋', '', {
          duration: 2000,
      });
    } else {
      this.query['pre'] = 9;
      this.rest.index('incomings', this.query).subscribe((data: any) => {
       const json = data.result.map( function (item) {
         if (item.status_at_last == 'back_late'){
           item.status_at_last = '晚归';
         }else if (item.status_at_last == 'back'){
           item.status_at_last = '已归';
         }else if (item.status_at_last == 'night_out'){
           item.status_at_last = '夜出';
         }else if (item.status_at_last == 'go_out'){
           item.status_at_last = '未归';
         }else  item.status_at_last = '异常';
         item.pass_time_at_last = new Date(item.pass_time_at_last).toLocaleString();
         return {
           '姓名':item.name,
           '学号':item.sno,
           '状态':item.status_at_last,
           '寝室':item.dorm_full_title,
           '时间':item.pass_time_at_last
         }
        });
        // console.log(json);

        this.sheetService.jsontToSheet(json,  'sheet1' + Date.parse(new Date().toString()) + '.xlsx');
      });
    }
  }
}
