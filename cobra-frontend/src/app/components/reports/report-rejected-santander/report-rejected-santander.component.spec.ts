import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportRejectedSantanderComponent } from './report-rejected-santander.component';

describe('ReportRejectedSantanderComponent', () => {
  let component: ReportRejectedSantanderComponent;
  let fixture: ComponentFixture<ReportRejectedSantanderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportRejectedSantanderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportRejectedSantanderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
