import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsPanelTableComponent } from './clients-panel-table.component';

describe('ClientsPanelTableComponent', () => {
  let component: ClientsPanelTableComponent;
  let fixture: ComponentFixture<ClientsPanelTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientsPanelTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientsPanelTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
