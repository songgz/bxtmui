import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoRecorderFormComponent } from './video-recorder-form.component';

describe('VideoRecorderFormComponent', () => {
  let component: VideoRecorderFormComponent;
  let fixture: ComponentFixture<VideoRecorderFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoRecorderFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoRecorderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
