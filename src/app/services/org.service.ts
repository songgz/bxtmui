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
      this.orgs = data;
    });
  }
}
