import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedUserComponent } from './created-user.component';

describe('CreatedUserComponent', () => {
  let component: CreatedUserComponent;
  let fixture: ComponentFixture<CreatedUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatedUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
