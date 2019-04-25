import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorFormComponent } from './floor-form.component';

describe('FloorFormComponent', () => {
  let component: FloorFormComponent;
  let fixture: ComponentFixture<FloorFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloorFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
