import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtFreeComponent } from './debt-free.component';

describe('DebtFreeComponent', () => {
  let component: DebtFreeComponent;
  let fixture: ComponentFixture<DebtFreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebtFreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebtFreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
