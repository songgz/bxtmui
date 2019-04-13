import { Injectable } from '@angular/core';
import {RestService} from './rest.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DictService {
  dicts: any[] = [];

  constructor(private rest: RestService) {
    this.load().then((data: any) => {
      this.dicts = data.result;
    });
  }

  async load() {
    return  await this.rest.index('dicts', {pre: 999}).toPromise();
  }

  getDictItems(dict_mark: string) {
    for (const dict of this.dicts) {
      if (dict.mark === dict_mark) {
        return dict.dict_items;
      }
    }
    return [];
  }

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
