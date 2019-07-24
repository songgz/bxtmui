import { Component, OnInit, AfterViewInit } from '@angular/core';
import {environment} from '../../../environments/environment';
import {RestService} from '../../services/rest.service';

@Component({
  selector: 'app-person-dialog',
  templateUrl: './person-dialog.component.html',
  styleUrls: ['./person-dialog.component.scss']
})
export class PersonDialogComponent implements OnInit, AfterViewInit {
  manager: any = { };
  imgsrc: any = '/assets/img/imghead.png';

  constructor(private rest: RestService) { }

  ngOnInit() {
  }
  inspection() {
    this.rest.show('managers/' + this.manager.id).subscribe((data: any) => {
      // 判断图片是否存在
      const ImgObj = new Image();
      ImgObj.src = environment.baseUrl + this.manager.avatar_url;
      if ( data.avatar_url != null && (ImgObj.width > 0 && ImgObj.height > 0) ) {
        this.imgsrc = environment.baseUrl + this.manager.avatar_url;
      } else {
        this.imgsrc = '/assets/img/imghead.png';
      }
    });
  }

  ngAfterViewInit() {
    this.inspection();
  }
}
