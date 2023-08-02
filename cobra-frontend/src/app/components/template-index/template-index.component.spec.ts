import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TemplateIndexComponent } from './template-index.component';

describe('TemplateIndexComponent', () => {
  let component: TemplateIndexComponent;
  let fixture: ComponentFixture<TemplateIndexComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
