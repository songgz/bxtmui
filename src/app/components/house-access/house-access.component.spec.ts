import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseAccessComponent } from './house-access.component';

describe('HouseAccessComponent', () => {
  let component: HouseAccessComponent;
  let fixture: ComponentFixture<HouseAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HouseAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
