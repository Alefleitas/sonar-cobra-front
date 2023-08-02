import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountBank } from '../models/account-bank';
import { RequestService } from '../core/services';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private requestService: RequestService) { }

  postAccountBank(accountBank: AccountBank): Observable<AccountBank> {
    return this.requestService.post('bankAccounts/postclientbankaccount', accountBank);
  }

  getAccounts(): Observable<AccountBank[]> {
    return this.requestService.get('bankAccounts/getClientBankAccounts');
  }

  validateCbu(accountBank: AccountBank): Observable<any> {
    return this.requestService.post('bankAccounts/validateBankAccount', accountBank);
  }

  deleteAccount(id: number): Observable<any> {
    return this.requestService.delete(`bankAccounts/DeleteClientBankAccount?id=${id}`);
  }

}
