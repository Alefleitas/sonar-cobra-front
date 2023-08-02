import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TableFeeComponent } from './table-fee.component';

describe('TableFeeComponent', () => {
  let component: TableFeeComponent;
  let fixture: ComponentFixture<TableFeeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TableFeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
