import { MatPaginatorIntl } from '@angular/material/paginator';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MatPaginatorIntlChinese extends MatPaginatorIntl  {
  /** A label for the page size selector. */
  itemsPerPageLabel = '每页条数: ';
  /** A label for the button that increments the current page. */
  nextPageLabel = '下一页';
  /** A label for the button that decrements the current page. */
  previousPageLabel = '上一页';
  /** A label for the button that moves to the first page. */
  firstPageLabel = '首页';
  /** A label for the button that moves to the last page. */
  lastPageLabel = '尾页';
  /** A label for the range of items within the current page and the length of the whole list. */
  getRangeLabel =  (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return '0 od' + length;
    }

    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length
      ? Math.min(startIndex + pageSize, length)
      : startIndex + pageSize;
    return `第${startIndex + 1}-${endIndex}条, 总共${length}条`;
  }
}
