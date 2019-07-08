import {Component, OnInit} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {RestService} from '../../services/rest.service';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {
  displayedColumns = ['title', 'path', 'updated_at', 'action'];
  dataSource: MatTableDataSource<any[]>;
  item_selected: any = {id: undefined};

  constructor(private rest: RestService) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.loadMenuItems();
    const info = {
      depth: 0,
      id: null
    };
    sessionStorage.setItem('key', JSON.stringify(info));
  }

  loadMenuItems() {
    this.rest.index('menu_items').subscribe((data: any) => {
      this.dataSource = data;
    });
  }

  update (id: string)  {
    this.rest.navigate(['/bxt/menu_items/', id, 'edit']);
  }
  addbox (depth: any , id: string, title: string)  {
    this.rest.navigate(['/bxt/menu_items/new']);
    const info = {
      depth: depth + 1,
      id: id,
      title: title
    };
    sessionStorage.setItem('key', JSON.stringify(info));

  }
  delete (id: string) {
    this.rest.confirm({title: 'Are you sure to delete this record?'}).afterClosed().subscribe(res => {
      if (res) {
        this.rest.destory('menu_items/' + id).subscribe(data => {
          this.loadMenuItems();
        }, error => {
          this.rest.errorHandle(error);
        });
      }
    });
  }
  chevron(item: any) {
    this.item_selected = item;
  }

}
