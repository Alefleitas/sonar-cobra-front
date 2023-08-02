import { Component, OnInit } from '@angular/core';
import { TemplateTokenReference } from 'src/app/models/template-token-reference';
import { TemplateTokenReferenceStub } from 'src/app/services/stubs/template-token-reference';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType, Template } from 'src/app/models/template';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StateService } from 'src/app/services/state.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-template-editor',
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.scss']
})
export class TemplateEditorComponent implements OnInit {

  templateReferences: Array<TemplateTokenReference>;
  notificationTypes: Array<NotificationType>;
  formGroup: FormGroup;
  isEditing = false;
  isLoading: boolean = false;
  notificationType: NotificationType;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Ingrese texto...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    // fonts: [
    //   {class: 'arial', name: 'Arial'},
    //   {class: 'times-new-roman', name: 'Times New Roman'},
    //   {class: 'calibri', name: 'Calibri'},
    //   {class: 'comic-sans-ms', name: 'Comic Sans MS'}
    // ],
    // customClasses: [
    //   {
    //     name: 'quote',
    //     class: 'quote',
    //   },
    //   {
    //     name: 'redText',
    //     class: 'redText'
    //   },
    //   {
    //     name: 'titleText',
    //     class: 'titleText',
    //     tag: 'h1',
    //   },
    // ],
    uploadWithCredentials: false,
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private stateService: StateService
  ) { }

  ngOnInit() {
    if (this.stateService.notificationType == undefined) {
      this.router.navigateByUrl("templates")
    }
    this.notificationType = this.stateService.notificationType;
    this.stateService.notificationType = undefined;
    if (this.notificationType.template) {
      this.isEditing = true;
      let template: Template = this.notificationType.template;
      this.formGroup = this.formBuilder.group({
        id: [template.id, [Validators.required]],
        htmlBody: [template.htmlBody, [Validators.required]],
        subject: [template.subject, [Validators.required]]
      });
    }
    else {
      this.formGroup = this.formBuilder.group({
        id: [0, [Validators.required]],
        htmlBody: ['', [Validators.required]],
        subject: ['', [Validators.required]]
      });
    }
    this.isLoading = true;
    this.notificationService.getTemplateTokenReferences().subscribe(x => {
      this.isLoading = false;
      this.templateReferences = x;
    });
  }

  saveTemplate(formGrp: FormGroup) {
    let template = new Template()
    let notificationTypeId = this.notificationType.id;
    template.id = formGrp.value.id;
    template.htmlBody = formGrp.value.htmlBody;
    template.subject = formGrp.value.subject;
    template.description = this.notificationType.description; //Por ahora es requerido el campo así que lo copio del notificationType
    this.isLoading = true;
    if (this.isEditing) {
      this.notificationService.updateTemplate(template).subscribe(x => {
        this.router.navigate(['templates']);
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
        alert(error);
      })
    } else {
      this.notificationService.createTemplate(template, notificationTypeId).subscribe(x => {
        this.isLoading = false;
        this.router.navigate(['templates']);
      }, error => {
        this.isLoading = false;
        alert(error);
      })
    }
  }
}
