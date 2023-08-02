import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateQuotesComponent } from './date-quotes.component';

describe('DateQuotesComponent', () => {
  let component: DateQuotesComponent;
  let fixture: ComponentFixture<DateQuotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateQuotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
