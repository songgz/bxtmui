import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetdormComponent } from './setdorm.component';

describe('SetdormComponent', () => {
  let component: SetdormComponent;
  let fixture: ComponentFixture<SetdormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetdormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetdormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
