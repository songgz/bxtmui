import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {RestService} from '../../services/rest.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.scss']
})
export class HolidayComponent implements OnInit, AfterViewInit {
  holidays: any[] = [];
  displayedColumns: string[] = ['title', 'date', 'action'];
  dataSource: MatTableDataSource<any[]>;
  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { read: true }) sort: MatSort;
  pageIndex = 0;
  pageSize = 10;
  pageLength = 0;
  holiday: any = {};

  constructor(private rest: RestService) {
    this.dataSource = new MatTableDataSource(this.holidays);
  }

  ngOnInit() {
    this.loadHolidays();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadHolidays(options = {}) {
    options['page'] = this.pageIndex + 1;
    options['pre'] = this.pageSize;
    this.rest.index('holidays', options).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.result);
      this.pageLength = data.paginate_meta.total_count;
      this.pageSize = data.paginate_meta.current_per_page;
      this.pageIndex = data.paginate_meta.current_page - 1;
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  paginate(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadHolidays();
  }
  //
  // applyFilter(filterValue: string) {
  //   filterValue = filterValue.trim(); // Remove whitespace
  //   filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
  //   this.dataSource.filter = filterValue;
  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  add(): void {
    this.holidays.push(this.holiday);
    this.dataSource = new MatTableDataSource(this.holidays);
  }

  create(f: NgForm) {
    this.rest.create('holidays', {holiday: f.value}).subscribe((data: any) => {
      this.holiday = data;
      this.loadHolidays();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  public delete (id: string) {
    this.rest.confirm({title: '你确定要删除这条数据?'}).afterClosed().subscribe(res => {
      if (res) {
        this.rest.destory('holidays/' + id).subscribe(data => {
          this.loadHolidays();
        }, error => {
          this.rest.errorHandle(error);
        });
      }
    });
  }

}
