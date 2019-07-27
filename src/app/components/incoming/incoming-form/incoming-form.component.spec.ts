import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingFormComponent } from './incoming-form.component';

describe('IncomingFormComponent', () => {
  let component: IncomingFormComponent;
  let fixture: ComponentFixture<IncomingFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomingFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
