import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAdvancePaymentsComponent } from './manage-advance-payments.component';

describe('ManageAdvancePaymentsComponent', () => {
  let component: ManageAdvancePaymentsComponent;
  let fixture: ComponentFixture<ManageAdvancePaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageAdvancePaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAdvancePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
