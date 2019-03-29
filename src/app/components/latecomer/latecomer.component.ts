import {Component, OnInit, ViewChild} from '@angular/core';
import {RestService} from '../../services/rest.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {OrgService} from '../../services/org.service';

@Component({
  selector: 'app-latecomer',
  templateUrl: './latecomer.component.html',
  styleUrls: ['./latecomer.component.scss']
})
export class LatecomerComponent implements OnInit {
  displayedColumns = [ 'user_name', 'pass_time', 'status',  'overtime' ];
  dataSource: MatTableDataSource<any[]>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private rest: RestService, public org: OrgService) {
    org.getOrgs();
  }

  ngOnInit() {
    this.loadLatecomers();
  }

  loadLatecomers() {
    this.rest.index('latecomers').subscribe((data: any) => {
      this.dataSource = data.result;
    });
  }

}
