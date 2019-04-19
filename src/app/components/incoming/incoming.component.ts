import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {RestService} from '../../services/rest.service';

@Component({
  selector: 'app-incoming',
  templateUrl: './incoming.component.html',
  styleUrls: ['./incoming.component.scss']
})
export class IncomingComponent implements OnInit, AfterViewInit {
  displayedColumns = [ 'name', 'sno', 'dept_title', 'dorm_title', 'pass_time', 'status', 'overtime', 'reside'];
  dataSource: MatTableDataSource<any[]>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private rest: RestService) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator.page.subscribe(event => {
      this.loadIncomings();
    });
  }

  ngOnInit() {
    this.paginator.pageSize = 10;
    this.paginator.pageIndex = 0;
    this.loadIncomings();
  }

  loadIncomings() {
    this.rest.index('incomings', {page: this.paginator.pageIndex + 1, pre: this.paginator.pageSize}).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.result);
      // 数据转换
      // for ( const i in this.dataSource.filteredData) {
      //   if (this.dataSource.filteredData[i].status_at_last === 'back') {
      //     this.dataSource.filteredData[i].status_at_last = '已归';
      //   } else if ( this.dataSource.filteredData[i].status_at_last === 'back_late') {
      //     this.dataSource.filteredData[i].status_at_last = '晚归';
      //   } else {
      //     this.dataSource.filteredData[i].status_at_last = this.dataSource.filteredData[i].status_at_last;
      //   }
      // }


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

}
