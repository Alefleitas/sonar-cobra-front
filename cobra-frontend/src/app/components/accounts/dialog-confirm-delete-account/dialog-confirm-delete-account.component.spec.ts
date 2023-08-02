import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmDeleteAccountComponent } from './dialog-confirm-delete-account.component';

describe('DialogConfirmDeleteAccountComponent', () => {
  let component: DialogConfirmDeleteAccountComponent;
  let fixture: ComponentFixture<DialogConfirmDeleteAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogConfirmDeleteAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogConfirmDeleteAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
