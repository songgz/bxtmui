import {Component, OnInit, ViewChild} from '@angular/core';
import {RestService} from '../../services/rest.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {map} from 'rxjs/operators';
import {DictService} from '../../services/dict.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {

  days: any[] = [
    {title: '国庆节', date: '2019-10-01' , date2: '2019-10-07'},
    {title: '劳动节', date: '2019-05-01' , date2: '2019-05-03'},
    {title: '儿童节', date: '2019-06-01' , date2: '2019-06-01'}
  ];
  displayedColumns: string[] = ['title', 'date', 'action'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  status: any[];

  constructor(private rest: RestService, private dict: DictService) {
    this.dataSource = new MatTableDataSource(this.days);
  }

  ngOnInit() {
    // this.paginator.pageSize = 10;
    // this.paginator.pageIndex = 0;
    // this.loadAttendances();
  }

  // loadAttendances() {
  //   this.rest.index('attendances', {page: this.paginator.pageIndex + 1, pre: this.paginator.pageSize}).subscribe((data: any) => {
  //     this.dataSource = new MatTableDataSource(data.result);
  //     this.paginator.length = data.paginate_meta.total_count;
  //     this.paginator.pageSize = data.paginate_meta.current_per_page;
  //     this.paginator.pageIndex = data.paginate_meta.current_page - 1;
  //   }, error => {
  //     this.rest.errorHandle(error);
  //   });
  // }
  //
  // applyFilter(filterValue: string) {
  //   filterValue = filterValue.trim(); // Remove whitespace
  //   filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
  //   this.dataSource.filter = filterValue;
  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  add(name: string , date: string, data2: string): void {
    this.days.push({title: name, date: date, date2: data2});
    this.dataSource = new MatTableDataSource(this.days);
  }
  delete (i: string) {
    this.rest.confirm({title: '你确定要删除这条数据?'}).afterClosed().subscribe(res => {
      if (res) {
        console.log(i);
        console.log(this.days);
        this.days.splice(1 , 1);
        this.dataSource = new MatTableDataSource(this.days);
      }
    });
  }

}
