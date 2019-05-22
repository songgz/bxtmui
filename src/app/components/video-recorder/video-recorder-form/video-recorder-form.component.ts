import { Component, OnInit } from '@angular/core';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-video-recorder-form',
  templateUrl: './video-recorder-form.component.html',
  styleUrls: ['./video-recorder-form.component.scss']
})
export class VideoRecorderFormComponent implements OnInit {
  video: any = {};
  constructor(private rest: RestService, private route: ActivatedRoute) { }


  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      if (params.get('id') != null) {
        this.video.id = params.get('id');
        this.edit();
      }
    });
  }

  save() {
    if (this.video.id != null) {
      this.update();
    } else {
      this.create();
    }
  }

  create() {
    this.rest.create('video_recorders', {'video_recorder': this.video}).subscribe((data: any) => {
      this.video = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  edit() {
    this.rest.show('video_recorders/' + this.video.id).subscribe((data: any) => {
      this.video = data;
    });
  }

  update() {
    this.rest.update('video_recorders/' + this.video.id, {'video-video_recorder': this.video}).subscribe((data: any) => {
      this.video = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }
  goBack() {
    this.rest.navigate(['/bxt/video-recorders']);
  }

}
