import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClientsAccountStateComponent } from './clients-account-state.component';

describe('ClientsAccountStateComponent', () => {
  let component: ClientsAccountStateComponent;
  let fixture: ComponentFixture<ClientsAccountStateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientsAccountStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientsAccountStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
