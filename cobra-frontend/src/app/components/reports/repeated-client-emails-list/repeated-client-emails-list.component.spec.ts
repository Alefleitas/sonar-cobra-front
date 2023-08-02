import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatedClientEmailsListComponent } from './repeated-client-emails-list.component';

describe('RepeatedClientEmailsListComponent', () => {
  let component: RepeatedClientEmailsListComponent;
  let fixture: ComponentFixture<RepeatedClientEmailsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepeatedClientEmailsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatedClientEmailsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
