import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QuotationsInput } from '../components/date-quotes/date-quotes.interface';
import { RequestService } from '../core/services';

@Injectable({
  providedIn: 'root',

})
export class DateQuotesService {

  constructor(private requestService: RequestService) { }

  getSourceQuoteByDate(date: Date, quotations: string[]): Observable<any> {
    return this.requestService.post(`Quotation/GetSourceQuoteByDate?date=${date}`, quotations);
  }

  getSourceTypes(): Observable<string[]> {
    return this.requestService.get(`Quotation/GetSourceTypes`);
  }

  informToSystems(quotations: QuotationsInput, systems: string[], date: Date): Observable<any> {
    return this.requestService.post(`Quotation/InformToSystems`, { quotationsOrigen: quotations.quotationsOrigen, generatedQuotations: quotations.generatedQuotations, systems: systems, date: date });

  }
}
