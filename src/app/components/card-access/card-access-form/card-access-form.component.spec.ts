import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAccessFormComponent } from './card-access-form.component';

describe('CardAccessFormComponent', () => {
  let component: CardAccessFormComponent;
  let fixture: ComponentFixture<CardAccessFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardAccessFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardAccessFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
