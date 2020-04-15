import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceAccessComponent } from './face-access.component';

describe('FaceAccessComponent', () => {
  let component: FaceAccessComponent;
  let fixture: ComponentFixture<FaceAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaceAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaceAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
