import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Template, NotificationType } from 'src/app/models/template';
import { NotificationService } from 'src/app/services/notification.service';
import { StateService } from 'src/app/services/state.service';
import { CommunicationService } from 'src/app/services/communication.service';
import {AngularEditorConfig} from "@kolkov/angular-editor";

@Component({
  selector: 'app-template-index',
  templateUrl: './template-index.component.html',
  styleUrls: ['./template-index.component.scss']
})
export class TemplateIndexComponent implements OnInit {

  isLoading: boolean;
  canCreateNewTemplate = false;
  notificationTypes: Array<NotificationType> = []
  editorConfig: AngularEditorConfig = {
    editable: false,
    spellcheck: false,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    enableToolbar: false,
    showToolbar: false,
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
    private stateService: StateService,
    private router: Router,
    private notificationService: NotificationService,
    private communicationService: CommunicationService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.notificationService.getNotificationTypes().subscribe(notificationTypes => {
      notificationTypes.forEach(notType => {
        this.notificationTypes.push(notType);
      });
      this.isLoading = false;
    }, error=>{
      //log(error);
      this.isLoading = false;
    });
  }

  editNotificationType(notificationType: NotificationType) {
    this.stateService.notificationType = notificationType;
    this.router.navigate(['create-template']);
  }

  toggleTemplate(id: number) {
    this.isLoading = true;
    this.communicationService.toggleTemplate(id).subscribe(x => {
      this.isLoading = false;
      if(x) {
        var nType = this.notificationTypes.find(nT => nT.template?.id === id);
        nType.template.disabled = !nType.template.disabled;
      }
    }, error => {
      console.log(error);
    });
  }
}
