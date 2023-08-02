import { Injectable } from '@angular/core';
import { RequestService } from '../core/services';
import { Observable } from 'rxjs';
import { ClientContactDetail, ContactDetail } from '../models/communication';
import { HttpParams } from '@angular/common/http';
import { Contact } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ContactDetailService {

  constructor(private requestService: RequestService) { }

  getContactDetails(userParam: any): Observable<any> {
    // let userParam = new HttpParams().set('userId', userId);
    return this.requestService.post('ContactDetail/GetAllByUserId', userParam);
  }

  getClientcontactDetails(contactDetail: any): Observable<any> {
    return this.requestService.post('ContactDetail/GetClienteDetalleContacto', contactDetail);
  }

  createOrUpdateContactDetail(contactDetail: any): Observable<any> {
    return this.requestService.post('ContactDetail/CreateOrUpdate', contactDetail);
  }

  removeContactDetail(id: number): Observable<boolean> {
    return this.requestService.delete(`ContactDetail/Delete/${id}`);
  }
}
