import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatedDebtDetailsListComponent } from './repeated-debt-details-list.component';

describe('RepeatedDebtDetailsListComponent', () => {
  let component: RepeatedDebtDetailsListComponent;
  let fixture: ComponentFixture<RepeatedDebtDetailsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepeatedDebtDetailsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatedDebtDetailsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
