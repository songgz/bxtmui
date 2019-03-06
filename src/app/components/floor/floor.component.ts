import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource, PageEvent} from '@angular/material';
import {RestService} from '../../services/rest.service';

@Component({
  selector: 'app-floor',
  templateUrl: './floor.component.html',
  styleUrls: ['./floor.component.scss']
})

export class FloorComponent implements OnInit {
  displayedColumns = ['floor', 'title', 'updated_at', 'action'];
  dataSource: MatTableDataSource<any[]>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private rest: RestService) {
  }

  // MatPaginator Inputs
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  pageIndex = 1;


  ngOnInit() {
    this.loadFloors();
  }
  loadFloors() {
    this.rest.index('floors' , {page: this.pageIndex, pre: this.pageSize}).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.result);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator.length = data.paginate_meta.total_count;
      this.dataSource.paginator.pageSize = data.paginate_meta.current_per_page;
      this.dataSource.paginator.pageIndex = data.paginate_meta.current_page;
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

  update (id: string)  {
    this.rest.navigate(['/bxt/floors/', id, 'edit']);
  }

  delete (id: string) {
    this.rest.confirm({title: 'Are you sure to delete this record?'}).afterClosed().subscribe(res => {
      if (res) {
        this.rest.destory('floors/' + id).subscribe(data => {
          this.loadFloors();
        }, error => {
          this.rest.errorHandle(error);
        });
      }
    });
  }

  switchPage(event: PageEvent) {
     console.log(event.pageSize);
     this.pageSize = event.pageSize;
     this.pageIndex = event.pageIndex + 1;
    this.loadFloors();

  }

}
