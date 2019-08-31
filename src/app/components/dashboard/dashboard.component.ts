import { Component, OnInit } from '@angular/core';
import {RestService} from '../../services/rest.service';
import {query} from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  houses: any[] = [];
  query: any = {};
  bed_stats: any = {};
  status_stats: any = {};
  status_values: number[] = [];
  object = Object;
  // Doughnut
  public doughnutChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public doughnutChartData: number[] = [350, 450, 100];
  public doughnutChartType: string;

  // Pie
  public pieChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
  public pieChartData: number[] = [300, 500, 100];
  public pieChartType: string;

  // events
  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }

  constructor(private rest: RestService) {
    this.getHouse();
  }

  ngOnInit() {
    this.doughnutChartType = 'doughnut';
    this.pieChartType = 'pie';
  }

  getHouse() {
    this.rest.index('houses', {pre: 999}).subscribe((data: any) => {
      this.houses = data.result;
      this.initBedStats();
      this.iniStatusStats();
    });
  }

  initBedStats() {
    this.query['pre'] = 1;
    this.rest.index('rooms', this.query).subscribe((data: any) => {
      this.bed_stats = data.bed_stats;
    });
  }

  iniStatusStats() {
    this.query['pre'] = 1;
    this.rest.index('incomings', this.query).subscribe((data: any) => {
      this.status_stats = data.status_stats;
      this.status_values = Object.values(data.status_stats);
    });
  }

  selectHouse() {
    this.initBedStats();
    this.iniStatusStats();
  }

}
