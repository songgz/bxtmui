import {Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-gate-log',
  templateUrl: './gate-log.component.html',
  styleUrls: ['./gate-log.component.scss']
})
export class GateLogComponent implements OnInit {
  displayedColumns = [ 'id', 'message', 'status'];
  dataSource: MatTableDataSource<any[]>;
  @ViewChild(MatPaginator, { read: true, static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { read: true, static: false }) sort: MatSort;

  constructor() { }

  ngOnInit() {
  }

}
