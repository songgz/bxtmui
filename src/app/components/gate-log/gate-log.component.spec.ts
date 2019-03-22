import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GateLogComponent } from './gate-log.component';

describe('GateLogComponent', () => {
  let component: GateLogComponent;
  let fixture: ComponentFixture<GateLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GateLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GateLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
