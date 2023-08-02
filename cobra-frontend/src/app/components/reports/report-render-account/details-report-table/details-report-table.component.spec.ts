import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsReportTableComponent } from './details-report-table.component';

describe('DetailsTableComponent', () => {
  let component: DetailsReportTableComponent;
  let fixture: ComponentFixture<DetailsReportTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsReportTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsReportTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
