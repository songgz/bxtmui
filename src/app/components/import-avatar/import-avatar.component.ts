import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-import-avatar',
  templateUrl: './import-avatar.component.html',
  styleUrls: ['./import-avatar.component.scss']
})
export class ImportAvatarComponent implements OnInit {
  URL = 'path_to_api';
  uploader: FileUploader = new FileUploader({
    url: 'http://www.download.com:80/uploadFile',
    method: 'POST',
    itemAlias: 'uploadedfile'
  });
  public hasBaseDropZoneOver = false;
  constructor() { }

  ngOnInit() {
  }
  saveImages() {
    const fileCount: number = this.uploader.queue.length;
    if (fileCount > 0) {
      this.uploader.queue.forEach((val, i, array) => {
        const fileReader = new FileReader();
        fileReader.onloadend = (e: any) => {
          const imageData = e.target.result;
          let rawData = imageData.split('base64,');
          if (rawData.length > 1) {
            rawData = rawData[1];
          }
        }
        fileReader.readAsDataURL(val._file);
      });
    }
  }

  selectedFileOnChanged() {
    this.uploader.queue.forEach((val, i, array) => {
      this.uploader.queue[0].onSuccess = (response, status, headers) => {
        if (status === 200) {

        } else {

        }
      };
      this.uploader.queue[0].upload();
    });
  }

  fileOverBase(event) {
    this.hasBaseDropZoneOver = event;
  }
  fileDropOver(event) {
    // 文件拖拽完成的回调函数
  }
}
