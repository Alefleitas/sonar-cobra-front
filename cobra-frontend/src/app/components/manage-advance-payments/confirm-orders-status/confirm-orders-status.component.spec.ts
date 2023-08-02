import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmOrdersStatusComponent } from './confirm-orders-status.component';

describe('ConfirmOrdersStatusComponent', () => {
  let component: ConfirmOrdersStatusComponent;
  let fixture: ComponentFixture<ConfirmOrdersStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmOrdersStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmOrdersStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
