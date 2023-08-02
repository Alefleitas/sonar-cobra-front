import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRestrictClientComponent } from './dialog-restrict-client.component';

describe('DialogRestrictClientComponent', () => {
  let component: DialogRestrictClientComponent;
  let fixture: ComponentFixture<DialogRestrictClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRestrictClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRestrictClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
