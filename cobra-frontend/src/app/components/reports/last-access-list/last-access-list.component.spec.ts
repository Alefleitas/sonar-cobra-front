import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastAccessListComponent } from './last-access-list.component';

describe('LastAccessListComponent', () => {
  let component: LastAccessListComponent;
  let fixture: ComponentFixture<LastAccessListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LastAccessListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LastAccessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
