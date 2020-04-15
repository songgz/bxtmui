import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceAccessFormComponent } from './face-access-form.component';

describe('FaceAccessFormComponent', () => {
  let component: FaceAccessFormComponent;
  let fixture: ComponentFixture<FaceAccessFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaceAccessFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaceAccessFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
