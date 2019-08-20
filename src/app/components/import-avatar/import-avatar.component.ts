import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-import-avatar',
  templateUrl: './import-avatar.component.html',
  styleUrls: ['./import-avatar.component.scss']
})
export class ImportAvatarComponent implements OnInit {
  URL = 'path_to_api';
  public uploader: FileUploader = new FileUploader({ url: this.URL});
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
    // 这里是文件选择完成后的操作处理
  }
}
