import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {RestService} from '../../services/rest.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-setdorm',
  templateUrl: './setdorm.component.html',
  styleUrls: ['./setdorm.component.scss']
})
export class SetdormComponent implements OnInit {
  toppings = new FormControl();
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  public username: any = '';
  public list = [];

  constructor(private rest: RestService, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  addData(e) {

    const obj = {     /* 定义一个对象 */
      username: this.username,
      status: 1
    }
    if (e.keyCode === 13) {
      this.list.push(obj);   /* 向数组中添加对象obj */
      this.username = '';     /* 清空输入框 */
    }
  }
  changeData(bbb) {   /*改变状态*/
    if (this.list[bbb].status === 2 ) {
      this.list[bbb].status = 1;
    } else {
    this.list[bbb].status = 2;
    }
  }

  deleteData(aaa) {
    this.list.splice(aaa, 1);   /*删除数组的数据*/
  }
}
