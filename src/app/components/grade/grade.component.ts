import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {RestService} from '../../services/rest.service';

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.scss']
})
export class GradeComponent implements OnInit {
  displayedColumns = [ 'title', 'college', 'department', 'updated_at', 'action'];
  dataSource: MatTableDataSource<any[]>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private rest: RestService) { }

  ngOnInit() {
    this.loadGrades();
  }

  loadGrades() {
    this.rest.index('grades').subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.result);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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

  public update (id: string)  {
    this.rest.navigate(['/bxt/grades/', id, 'edit']);
  }

  public delete (id: string) {
    this.rest.confirm({title: 'Are you sure to delete this record?'}).afterClosed().subscribe(res => {
      if (res) {
        this.rest.destory('grades/' + id).subscribe(data => {
          this.loadGrades();
        }, error => {
          this.rest.errorHandle(error);
        });
      }
    });
  }
}
