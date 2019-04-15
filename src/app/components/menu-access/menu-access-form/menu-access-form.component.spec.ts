import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuAccessFormComponent } from './menu-access-form.component';

describe('MenuAccessFormComponent', () => {
  let component: MenuAccessFormComponent;
  let fixture: ComponentFixture<MenuAccessFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuAccessFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuAccessFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
