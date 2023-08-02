import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuotationsComponent } from './quotations.component';

describe('QuotationsComponent', () => {
  let component: QuotationsComponent;
  let fixture: ComponentFixture<QuotationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
