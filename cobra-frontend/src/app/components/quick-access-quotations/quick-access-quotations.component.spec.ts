import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickAccessQuotationsComponent } from './quick-access-quotations.component';

describe('QuickAccessQuotationsComponent', () => {
  let component: QuickAccessQuotationsComponent;
  let fixture: ComponentFixture<QuickAccessQuotationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickAccessQuotationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickAccessQuotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
