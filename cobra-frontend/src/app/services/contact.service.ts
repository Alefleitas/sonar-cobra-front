import { Contact } from './../models/contact';
import { Injectable } from '@angular/core';
import { RequestService } from '../core/services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(
    private requestService: RequestService
  ) { }

  send(contact: Contact, attachments): Observable<any> {
    const formData: FormData = new FormData();
    if(attachments.length){
      for(let i=0 ; i < attachments.length ; i++)
      formData.append('attachments', attachments[i], attachments[i].name);
    }
    formData.append('contactForm', JSON.stringify(contact));
    return this.requestService.post('Contact/Send', formData);
}

}
