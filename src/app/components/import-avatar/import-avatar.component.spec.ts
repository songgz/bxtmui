import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportAvatarComponent } from './import-avatar.component';

describe('ImportAvatarComponent', () => {
  let component: ImportAvatarComponent;
  let fixture: ComponentFixture<ImportAvatarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportAvatarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
