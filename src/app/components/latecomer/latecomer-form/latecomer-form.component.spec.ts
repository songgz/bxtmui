import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatecomerFormComponent } from './latecomer-form.component';

describe('LatecomerFormComponent', () => {
  let component: LatecomerFormComponent;
  let fixture: ComponentFixture<LatecomerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatecomerFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatecomerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
