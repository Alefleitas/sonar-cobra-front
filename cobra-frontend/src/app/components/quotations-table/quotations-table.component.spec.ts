import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationsTableComponent } from './quotations-table.component';

describe('QuotationsTableComponent', () => {
  let component: QuotationsTableComponent;
  let fixture: ComponentFixture<QuotationsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
