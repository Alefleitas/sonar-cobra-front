import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AutomaticPayment } from '../models/automatic-payment';
import { RequestService } from '../core/services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutomaticDebitService {

  constructor( private requestService: RequestService) { }

  getAutomaticPayments(): Observable<AutomaticPayment[]> {
    return this.requestService.get('automaticPayments/all');
  }

  cancelAutomaticPayment(id: number): Observable<any> {
    return this.requestService.delete(`automaticPayments/delete?automaticPaymentId=${id}`);
  }

  newAutomaticPayment(ap: any): Observable<AutomaticPayment> {
    return this.requestService.post('automaticPayments/new', ap);
  }
}
