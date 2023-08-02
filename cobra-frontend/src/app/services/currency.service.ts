import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Currency } from '../models/currency';
@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor( private http: HttpClient) { }



  public getCurrencys()  {
    return this.http.get('valorURL').toPromise();
  }


  public postCurrency(currency:Currency)  {
    return this.http.post('valorURL',currency).toPromise();
  }

}
