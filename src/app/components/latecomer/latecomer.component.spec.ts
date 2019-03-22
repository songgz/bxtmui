import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatecomerComponent } from './latecomer.component';

describe('LatecomerComponent', () => {
  let component: LatecomerComponent;
  let fixture: ComponentFixture<LatecomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatecomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatecomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
