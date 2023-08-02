import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RequestService } from "../core/services/request.service";
import { Summary } from "../models/summary";
import { SummaryAdvance } from "../models/summary-advance"
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SummaryService {
  constructor(private requestService: RequestService) {}

  GetPaymentsSummary(cuit: string, productCode: string): Observable<Summary> {
    return this.requestService.get(
      `payments/getPaymentsSummary?clientCuit=${cuit}&productCode=${productCode}`
    );
  }

  GetPaymentsForAdvance(cuit: string, productCode: string, selectedCuit: string): Observable<SummaryAdvance> {
    return this.requestService.get(
      `payments/GetPaymentsForAdvance?clientCuit=${cuit}&productCode=${productCode}&selectedCuit=${selectedCuit}`
    );
  }
}
