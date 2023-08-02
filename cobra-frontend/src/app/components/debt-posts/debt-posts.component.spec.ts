import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DebtPostsComponent } from './debt-posts.component';

describe('DebtPostsComponent', () => {
  let component: DebtPostsComponent;
  let fixture: ComponentFixture<DebtPostsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DebtPostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebtPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
