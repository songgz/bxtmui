import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {RestService} from '../../services/rest.service';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {
  displayedColumns = ['title', 'path', 'updated_at', 'action', 'showhidden'];
  dataSource: MatTableDataSource<any[]>;

  constructor(private rest: RestService) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.loadMenuItems();
  }

  loadMenuItems() {
    this.rest.index('menu_items').subscribe((data: any) => {
      this.dataSource = data;
    });
  }

  update (id: string)  {
    this.rest.navigate(['/bxt/menu_items/', id, 'edit']);
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

}
