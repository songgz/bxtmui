import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {map} from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {Observable} from 'rxjs';
import {OrgService} from '../../services/org.service';
import {DictService} from '../../services/dict.service';
import {RestService} from '../../services/rest.service';
import {ImgDialogStudentComponent} from '../student/student.component';
import {environment} from '../../../environments/environment';
import {ExcelFileService} from '../../services/excel-file.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-homing',
  templateUrl: './homing.component.html',
  styleUrls: ['./homing.component.scss']
})
export class HomingComponent implements OnInit, AfterViewInit {
  displayedColumns = [ 'name', 'sno', 'dorm_title', 'pass_time', 'direction'];
  dataSource: MatTableDataSource<any[]>;
  query: any = {};
  moreserch = false;
  genders: Observable<any[]>;
  houses: Observable<any[]>;
  floors:  Observable<any[]>;
  rooms: Observable<any[]>;
  house_id = null;
  floor_id = null;
  dorm_id = null;

  sleep_status: any = {};
  color_status: any = {};
  color_direction: any = {};
  direct_stats: any = {};
  baseUrl: any;
  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  pageIndex = 0;
  pageSize = 10;
  pageLength = 0;
  progressbar = 0;
  direction_type: any = {};
  private dataMap: any = [];
  show = false;
  file: ExcelFileService = null;
  statusDays = { days_in: '入侵', go_out: '出寝'};

  constructor(
    private rest: RestService,
    private  dict: DictService,
    public org: OrgService,
    public dialog: MatDialog) {
    this.dict.getItems('sleep_status').subscribe(data => {
      for (const item of data) {
        this.sleep_status[item.mark] = item.title;
        this.color_status[item.mark] = item.color;
      }
    });
    this.dict.getItems('direction_type').subscribe(data => {
      for ( const item of data ) {
        this.direction_type[item.mark] = item.title;
        this.color_direction[item.mark] = item.color;
      }
      // console.log(this.direction_type);
    });

    this.org.getOrgs();
    this.dataSource = new MatTableDataSource([]);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  paginate(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadHomings(this.query);
  }

  ngOnInit() {
    this.baseUrl = environment.baseUrl;
    this.genders = this.dict.getItems('gender_type');
    this.getHouses();
    this.getHouseId();
  }

  loadHomings(options = {}) {
    this.progressbar = 0;
    if (this.show) {
      this.show = !this.show;
    }
    options['page'] = this.pageIndex + 1;
    options['pre'] = this.pageSize;
    this.rest.index('homings', options).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.result);
      this.dataSource.sort = this.sort;
      this.pageLength = data.paginate_meta.total_count;
      this.pageSize = data.paginate_meta.current_per_page;
      this.pageIndex = data.paginate_meta.current_page - 1;
      this.direct_stats = data.direct_stats;
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  applyFilter(filterValue: string = '') {
    if (this.query.org_id == null) {
      delete this.query.org_id;
    }
    if (this.house_id) {
      this.query.facility_id = this.house_id;
      this.dorm_id = null;
      this.floor_id = null;
      this.getFloors(this.house_id);
    }
    // console.log(this.query);
    this.loadHomings(this.query);
  }
  setFloor() {
    this.query.facility_id = this.floor_id;
    this.getRooms(this.floor_id);
    this.loadHomings(this.query);
  }
  setRoom() {
    this.query.facility_id = this.dorm_id;
    this.loadHomings(this.query);
  }

  getRooms(floorId: string) {
    const options = {};
    options['pre'] = 9999;
    options['parent_id'] = floorId;
    this.rest.index('rooms', options ).subscribe((data: any) => {
      // console.log(data.result);
      this.rooms = data.result;
    });
  }
  getFloors(houseId: string) {
    const options = {};
    options['pre'] = 999;
    options['parent_id'] = houseId;
    this.rest.index('floors', options ).subscribe((data: any) => {
      this.floors = data.result;
    });
  }
  getHouses() {
    this.houses = this.rest.index('houses').pipe(map((res: any) => res.result));
  }
  getHouseId() {
    this.houses.subscribe( data => {
      this.house_id = data[0].id;
      this.applyFilter();
    });
  }

  moreserchbtn() {
    if (this.moreserch === false) {
      this.moreserch = true;
    } else {
      this.moreserch = false;
    }
  }
  openDialog(id: string) {
    this.dialog.open(ImgDialogStudentComponent, {
      data: {
        dataid: id
      }
    });
  }
  test () {
    this.show = !this.show;
    this.dataMap = [];
    if (this.show) {
      this.progressbar = 10;
    const testData = [];
    const options = this.query;
    options['pre'] = 999;
    console.log(options);
    this.rest.index('homings', options).subscribe((data: any) => {
      this.progressbar = 50;
      data.result.forEach( p => {
        console.log(p);
        this.dataMap.push(p);
        this.progressbar = (this.dataMap.length / data.result.length * 100 - 50) + 50;
      });
    }, error => {
      this.rest.errorHandle(error);
    });
  } else {
      this.progressbar = 0;
    }
  }
  // async export_excel() {
  //   alert('批量导出');
  // }
  async export_excel() {
    this.progressbar = 1;
    this.file = new ExcelFileService(['姓名', '学号', '公寓', '出入时间', '出入']);
    this.query['pre'] = 100;
    const len = this.pageLength / 100 ;
    for (let i = 0; i <= len; i++ ) {
      this.query['page'] = i + 1;
      const data1: any = await this.rest.index('homings', this.query).toPromise();
      data1.result.forEach(d => {
        if (d.confirmed) {
          d.confirmed = d.cause;
        } else {
          d.confirmed = '未确认';
        }
        this.file.addRow([
          d.name,
          d.sno,
          d.dorm_full_title,
          new DatePipe('en-us').transform(d.pass_time_at_last, 'yyyy-MM-dd HH:mm:ss'),
          this.direction_type[d.direction_at_last]
        ]);
      });
      this.progressbar = (i + 1) / len * 100;
    }
    this.file.save('sheet1');
  }

}
