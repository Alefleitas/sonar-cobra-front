import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedDebtFilesComponent } from './published-debt-files.component';

describe('PublishedDebtFilesComponent', () => {
  let component: PublishedDebtFilesComponent;
  let fixture: ComponentFixture<PublishedDebtFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublishedDebtFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishedDebtFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
