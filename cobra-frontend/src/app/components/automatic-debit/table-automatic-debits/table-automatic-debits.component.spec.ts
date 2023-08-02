import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TableAutomaticDebitsComponent } from './table-automatic-debits.component';

describe('TableAutomaticDebitsComponent', () => {
  let component: TableAutomaticDebitsComponent;
  let fixture: ComponentFixture<TableAutomaticDebitsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TableAutomaticDebitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableAutomaticDebitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
