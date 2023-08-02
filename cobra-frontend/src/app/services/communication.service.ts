import { Injectable } from '@angular/core';
import { RequestService } from '../core/services';
import { Observable } from 'rxjs';
import { Communication } from '../models/communication';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  constructor(private requestService: RequestService) { }

  getCommunications(accountBalanceId: number): Observable<Communication[]> {
    return this.requestService.get(`Communication/GetCommunications?accountBalanceId=${accountBalanceId}`);
  }

  saveCommunication(comm: any): Observable<Communication>{
    return this.requestService.post('Communication/CreateOrUpdate', comm);
  }

  deleteCommunication(id): Observable<boolean>{
    return this.requestService.delete('Communication/Delete/' + id);
  }

  toggleTemplate(id: number) {
    return this.requestService.put(`Communication/ToggleTemplate/${id}`, {});
  }
}
