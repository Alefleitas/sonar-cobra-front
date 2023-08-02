import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirAutoDebitsComponent } from './confir-auto-debits.component';

describe('ConfirAutoDebitsComponent', () => {
  let component: ConfirAutoDebitsComponent;
  let fixture: ComponentFixture<ConfirAutoDebitsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirAutoDebitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirAutoDebitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
