import { Injectable } from '@angular/core';
import {RestService} from './rest.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DictService {

  constructor(private rest: RestService) { }

  getItems(dict_mark: string) {
    return this.rest.index('dicts', {dict_mark: dict_mark}).pipe(map((res: any) =>  res.result[0].dict_items));
  }

  getItemMap(dict_mark: string) {
    return this.rest.index('dicts', {dict_mark: dict_mark}).pipe(map((res: any) => {
      const h = {};
      for (const item of res.result[0].dict_items) {
        h[item.mark] = item.title;
      }
      return h;
    }));
  }
}
