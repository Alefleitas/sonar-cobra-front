import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewCommunicationDialogComponent } from './new-communication-dialog.component';

describe('NewCommunicationDialogComponent', () => {
  let component: NewCommunicationDialogComponent;
  let fixture: ComponentFixture<NewCommunicationDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCommunicationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCommunicationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
