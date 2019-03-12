import { Injectable } from '@angular/core';
import {RestService} from './rest.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DictService {

  constructor(private rest: RestService) { }

  getItems(dict_name: string) {
    return this.rest.index('dicts', {dn: dict_name}).pipe(map((res: any) =>  res.result[0].dict_items));
  }

  getItemMap(dict_name: string) {
    return this.rest.index('dicts', {dn: dict_name}).pipe(map((res: any) => {
      const h = {};
      for (const item of res.result[0].dict_items) {
        h[item.name] = item.title;
      }
      return h;
    }));
  }
}
