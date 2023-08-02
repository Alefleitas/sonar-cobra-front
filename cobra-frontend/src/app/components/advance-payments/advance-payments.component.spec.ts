import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancePaymentsComponent } from './advance-payments.component';

describe('AdvancePaymentsComponent', () => {
  let component: AdvancePaymentsComponent;
  let fixture: ComponentFixture<AdvancePaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancePaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
