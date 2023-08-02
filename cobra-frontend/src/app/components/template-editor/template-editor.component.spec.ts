import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TemplateEditorComponent } from './template-editor.component';

describe('TemplateEditorComponent', () => {
  let component: TemplateEditorComponent;
  let fixture: ComponentFixture<TemplateEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
