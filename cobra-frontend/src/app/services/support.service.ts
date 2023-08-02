import { Injectable } from '@angular/core';
import { ClientSupport } from '../models/clientSupport';
import { RequestService } from '../core/services';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth';
import {UserLastAccess} from "../models/user-last-access";
import {RepeatedDebtDetails} from "../models/repeated-debt-details";
import {RepeatedClientEmail} from "../models/repeated-client-email";
import { AuditoryCurrencyProfile } from './auditory-profile-currency';
import { CreatedUser } from '../models/created-user.model';
import { UserRestrictions } from '../models/user-restrictions';

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  constructor(private requestService: RequestService) {}

  public getAllClients(): Observable<ClientSupport[]> {
    return this.requestService.get('support/GetAllClients');
  }

  public loginAsClient(clientId: string): Observable<string> {
    return this.requestService.post(`login/LoginAsClient/${clientId}`, undefined);
  }

  public getAllLastAccess(): Observable<UserLastAccess[]> {
    return this.requestService.get('login/GetAllLastAccess');
  }
  public getAllRepeatedDebtDetails(): Observable<RepeatedDebtDetails[]> {
    return this.requestService.get('payments/GetAllRepeatedDebtDetails');
  }
  public getAllRepeatedClientEmails(): Observable<RepeatedClientEmail[]> {
    return this.requestService.get('login/GetAllClientDuplicatedEmails');
  }

  public getAuditoryProfileCurrency(): Observable<AuditoryCurrencyProfile[]> {
    return this.requestService.get('clientProfile/GetClientProfileControl');
  }

  public getGetAllCreatedUsers(): Observable<CreatedUser[]> {
    return this.requestService.get('login/GetAllCreatedUsers');
  }

  getCompleteRestrictionsList(): Observable<UserRestrictions[]> {
    return this.requestService.get('RestrictionsList/GetCompleteRestrictionsList');
  }

  getRestrictionsListByUserId(userId: string): Observable<UserRestrictions[]> {
    return this.requestService.get(`RestrictionsList/GetRestrictionsListByUserId?userId=${userId}`);
  }

  postRestrictionsList(newRestrictions: UserRestrictions[]): Observable<any> {
    return this.requestService.post('RestrictionsList/PostRestrictionList', newRestrictions);
  }

  deleteRestrictionsByUserId(userId: string): Observable<boolean> {
    return this.requestService.delete(`RestrictionsList/DeleteRestrictionsByUserId?userId=${userId}`);
  }

  getLockAdvancePayments(): Observable<boolean> {
    return this.requestService.get(`RestrictionsList/GetLockAdvancePayments/`);
  }

  setLockAdvancePayments(locked: any): Observable<any> {
    return this.requestService.put(`RestrictionsList/SetLockAdvancePayments`, locked);
  }
}
