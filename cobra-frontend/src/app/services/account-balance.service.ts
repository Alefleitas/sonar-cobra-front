import { Injectable } from '@angular/core';
import { RequestService } from '../core/services/request.service';
import { Observable } from 'rxjs';
import { AccountBalance } from '../models/account-balance';
import { PaymentDetail } from '../models';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AccountBalanceService {

  constructor(private requestService: RequestService) { }

  update(ac: any): Observable<any>{
    return this.requestService.post('AccountBalance/UpdateAccountBalance', ac);
  }
  getAllForReport(params?: string): Observable<any>{
    return this.requestService.get(!params ? 'AccountBalance/GetAllForReport' : `AccountBalance/GetAllForReport?${params}`);
  }

  getAll(params?: string): Observable<any>{
    return this.requestService.get(!params ? 'AccountBalance/GetAll' : `AccountBalance/GetAll?${params}`);
  }

  getAllProjects(): Observable<string[]> {
    return this.requestService.get('AccountBalance/GetAllProjects');
  }

  getPaymentDetails(accountBalanceId): Observable<PaymentDetail[]>{
    let accountBalanceIdParam = new HttpParams().set('accountBalanceId', accountBalanceId);
    return this.requestService.get('AccountBalance/GetPaymentDetails', accountBalanceIdParam);
  }
}
