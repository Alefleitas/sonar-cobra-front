import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsTourComponent } from './payments-tour.component';

describe('PaymentsTourComponent', () => {
  let component: PaymentsTourComponent;
  let fixture: ComponentFixture<PaymentsTourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentsTourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
