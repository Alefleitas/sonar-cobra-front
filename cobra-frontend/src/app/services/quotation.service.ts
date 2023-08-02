import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from '../core/services';
import { DolarMEP, QuotationList } from '../models/quotation';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {

  constructor(private requestService: RequestService) { }

  getQuotations(): Observable<QuotationList[]> {
    return this.requestService.get("quotation/GetQuotations");
  }

  getLastQuotation(quotationType: string): Observable<any> {
    return this.requestService.get(`quotation/GetLastQuotation?quotationType=${quotationType}`);
  }

  getCurrentQuotation(quotationType: string): Observable<any> {
    return this.requestService.get(`quotation/GetCurrentQuotation?quotationType=${quotationType}`);
  }

  addQuotation(quotationType: string, quotation: any): Observable<any> {
    return this.requestService.post(`quotation/AddQuotation?quotationType=${quotationType}`, quotation);
  }

  getLastDetalleDeudaUSD(): Observable<number> {
    return this.requestService.get('quotation/GetLastDetalleDeudaUSD');
  }

  getAllQuotation(quotationType: string): Observable<any> {
    return this.requestService.get(`quotation/GetAllQuotations/${quotationType}`);
  }

  getBonosConfiguration(): Observable<any> {
    return this.requestService.get('quotation/GetBonosConfiguration');
  }

  postBonosConfiguration(bonos) {
    return this.requestService.post('quotation/PublishQuotationByBono', bonos)
  }

}
