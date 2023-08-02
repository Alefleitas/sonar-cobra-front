import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogTermsComponent } from './dialog-terms.component';

describe('DialogTermsComponent', () => {
  let component: DialogTermsComponent;
  let fixture: ComponentFixture<DialogTermsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
