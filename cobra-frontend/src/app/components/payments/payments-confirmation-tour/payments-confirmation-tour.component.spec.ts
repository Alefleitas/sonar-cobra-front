import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsConfirmationTourComponent } from './payments-confirmation-tour.component';

describe('PaymentsConfirmationTourComponent', () => {
  let component: PaymentsConfirmationTourComponent;
  let fixture: ComponentFixture<PaymentsConfirmationTourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentsConfirmationTourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsConfirmationTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
