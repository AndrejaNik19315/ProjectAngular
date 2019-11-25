import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupModalAlertComponent } from './popup-modal-alert.component';

describe('PopupModalAlertComponent', () => {
  let component: PopupModalAlertComponent;
  let fixture: ComponentFixture<PopupModalAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupModalAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupModalAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
