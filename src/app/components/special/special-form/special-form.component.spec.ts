import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialFormComponent } from './special-form.component';

describe('SpecialFormComponent', () => {
  let component: SpecialFormComponent;
  let fixture: ComponentFixture<SpecialFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
