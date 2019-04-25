import {Injectable} from '@angular/core';
import {RestService} from './rest.service';

@Injectable({
  providedIn: 'root'
})
export class OrgService {
  public orgs: any[] = [];
  public classrooms: any[] = [];
  public departments: any[] = [];
  public colleges: any[] = [];

  constructor(private rest: RestService) {
  }

  getOrgs() {
    this.rest.index('orgs').subscribe((data: any[]) => {
      this.orgs = data;
    });
  }

  getClassrooms() {
    this.rest.index('classrooms', {pre: 9999}).subscribe((data: any) => {
      this.classrooms = data.result;
    });
  }

  getDepartments() {
    this.rest.index('departments', {pre: 9999}).subscribe((data: any) => {
      this.departments = data.result;
    });
  }

  getColleges() {
    this.rest.index('colleges', {pre: 9999}).subscribe((data: any) => {
      this.colleges = data.result;
    });
  }
}
