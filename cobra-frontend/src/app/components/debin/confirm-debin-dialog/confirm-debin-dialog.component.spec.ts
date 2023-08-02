import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDebinDialogComponent } from './confirm-debin-dialog.component';

describe('ConfirmDebinDialogComponent', () => {
  let component: ConfirmDebinDialogComponent;
  let fixture: ComponentFixture<ConfirmDebinDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDebinDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDebinDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
