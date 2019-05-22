import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-gate-log',
  templateUrl: './gate-log.component.html',
  styleUrls: ['./gate-log.component.scss']
})
export class GateLogComponent implements OnInit {
  displayedColumns = [ 'id', 'message', 'status'];
  dataSource: MatTableDataSource<any[]>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() { }

  ngOnInit() {
  }

}
