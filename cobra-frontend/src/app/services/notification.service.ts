import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from '../core/services';
import { NotificationType, Template } from '../models/template';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private requestService: RequestService
  ) { }

  getTemplateTokenReferences(): Observable<any> {
    return this.requestService.get('Notification/GetTemplateTokenReferences');
  }

  getNotificationTypes(): Observable<Array<NotificationType>> {
    return this.requestService.get('Notification/GetNotificationTypes');
  }

  createTemplate(template: Template, notificationTypeId: number): Observable<any> {
    return this.requestService.post('Notification/CreateTemplate/' + notificationTypeId, template);
  }

  updateTemplate(template: Template): Observable<any> {
    return this.requestService.put('Notification/UpdateTemplate', template);
  }
}
