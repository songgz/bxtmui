import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {RestService} from '../../services/rest.service';
import {DictService} from '../../services/dict.service';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.scss']
})
export class AccessComponent implements OnInit, AfterViewInit {
  displayedColumns = [ 'title', 'ip', 'direction', 'status', 'action'];
  dataSource: MatTableDataSource<any[]>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  direction_types = {};

  constructor(private rest: RestService, private dict: DictService) {
    this.dataSource = new MatTableDataSource([]);
    this.dict.getItemMap('direction_type').subscribe(data => {
      this.direction_types = data;
    });
  }

  ngOnInit() {
    this.paginator.pageSize = 10;
    this.paginator.pageIndex = 0;
    this.loadAccess();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator.page.subscribe(event => {
      this.loadAccess();
    });
  }
  loadAccess() {
    this.rest.index('accesses', {page: this.paginator.pageIndex + 1, pre: this.paginator.pageSize}).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.result);
      this.paginator.length = data.paginate_meta.total_count;
      this.paginator.pageSize = data.paginate_meta.current_per_page;
      this.paginator.pageIndex = data.paginate_meta.current_page - 1;
    }, error => {
      this.rest.errorHandle(error);
    });
  }
  update (id: string)  {
    this.rest.navigate(['/bxt/accesses/', id, 'edit']);
  }
  delete (id: string) {
    this.rest.confirm({title: '你确定要删除这条数据?'}).afterClosed().subscribe(res => {
      if (res) {
        this.rest.destory('accesses/' + id).subscribe(data => {
          this.loadAccess();
        }, error => {
          this.rest.errorHandle(error);
        });
      }
    });
  }
}
