import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomingComponent } from './homing.component';

describe('HomingComponent', () => {
  let component: HomingComponent;
  let fixture: ComponentFixture<HomingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
