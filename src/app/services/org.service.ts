import {Injectable} from '@angular/core';
import {RestService} from './rest.service';

@Injectable({
  providedIn: 'root'
})
export class OrgService {
  public orgs: any[] = [];

  constructor(private rest: RestService) {
  }

  getOrgs() {
    this.rest.index('orgs').subscribe((data: any[]) => {
      let pre: any = {};
      for (const res of data) {
        if (pre.depth < res.depth) {
          res.title = pre.title + '<<' + res.title;
        }
        pre = res;
      }
      this.orgs = data;
    });
  }
}
