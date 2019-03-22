import {Component, OnInit, ViewChild} from '@angular/core';
import {RestService} from '../../services/rest.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-latecomer',
  templateUrl: './latecomer.component.html',
  styleUrls: ['./latecomer.component.scss']
})
export class LatecomerComponent implements OnInit {
  displayedColumns = [ 'user_name', 'day', 'status'];
  dataSource: MatTableDataSource<any[]>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private rest: RestService) { }

  ngOnInit() {
    this.loadLatecomers();
  }

  loadLatecomers() {
    this.rest.index('latecomers').subscribe((data: any) => {
      this.dataSource = data.result;
    });
  }

}
