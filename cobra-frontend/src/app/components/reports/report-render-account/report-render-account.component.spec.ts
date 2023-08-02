import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportRenderAccountComponent } from './report-render-account.component';

describe('ReportRenderAccountComponent', () => {
  let component: ReportRenderAccountComponent;
  let fixture: ComponentFixture<ReportRenderAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportRenderAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportRenderAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
