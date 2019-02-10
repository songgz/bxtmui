import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeFormComponent } from './college-form.component';

describe('CollegeFormComponent', () => {
  let component: CollegeFormComponent;
  let fixture: ComponentFixture<CollegeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollegeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollegeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
