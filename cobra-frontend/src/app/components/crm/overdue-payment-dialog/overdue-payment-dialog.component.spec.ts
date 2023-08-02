import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OverduePaymentDialogComponent } from './overdue-payment-dialog.component';

describe('OverduePaymentDialogComponent', () => {
  let component: OverduePaymentDialogComponent;
  let fixture: ComponentFixture<OverduePaymentDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OverduePaymentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverduePaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
