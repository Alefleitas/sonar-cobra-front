import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebinComponent } from './debin.component';

describe('DebinComponent', () => {
  let component: DebinComponent;
  let fixture: ComponentFixture<DebinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
