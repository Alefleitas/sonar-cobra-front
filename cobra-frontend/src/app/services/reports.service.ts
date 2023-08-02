import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from '../core/services/request.service';
import { DebtRejection } from '../models/debt-rejection.model';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private requestService: RequestService) {}

  GetDebtRejections(fechaDesde : Date, fechaHasta : Date): Observable<DebtRejection> {

    let params = new HttpParams();
    if(fechaDesde){
      params = params.append('FechaDesde', new Date(fechaDesde).toISOString());
    };
    if(fechaHasta){
      params = params.append('FechaHasta', new Date(fechaHasta).toISOString());
    }

    return this.requestService.get(
      `Payments/GetPublishDebtRejections`, params
    );
  }

}
