import { Injectable } from '@angular/core';
import { Payment, PaymentHistory, UnappliedPayment, PaymentInformationBanner, InformPayments, SelectedPayments, PaymentReport } from '../models/payment';
import { RequestService } from '../core/services';
import { Observable } from 'rxjs';
import { Property, PublishDebinRequest, User } from '../models';
import { ExchangeRate } from '../models/exchangeRate';
import { OrderAdvanceFee } from '../models/order-advance-fee.model';
import { PublishedDebtFile } from '../models/published-debt-file.model';
import { CvuEntity } from '../models/cvu-entity';
import { DebtFree } from '../models/debt-free';
import { Debin, InformDebin } from '../models/debin';
import { ReporteRendiciones, ReportPaymentDetail } from '../models/rendition-report';
import { HttpParams } from '@angular/common/http';
import { AdvanceFeeResponse } from '../models/advance-fee-response';
import { EAdvanceFeeStatus } from '../models/summary-advance';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  isRequesting: boolean;
  selectedPayments: SelectedPayments;

  constructor( private requestService: RequestService) { }


  getPayments(): Observable<Payment[]> {
    return this.requestService.get<Payment[]>('payments/getPayments');
  }

  getPaymentsByFFileName(cuit: string, fFileName: string): Observable<Payment[]> {
    return this.requestService.get(`payments/GetPaymentsByFFileName?Cuit=${cuit}&&FFileName=${fFileName}`);
  }

  getExchangeRates(): Observable<ExchangeRate> {
    return this.requestService.get('payments/getLastExchangeRate');
  }

  postPayments(publishDebinRequest: PublishDebinRequest ): Observable<PublishDebinRequest> {
    this.isRequesting = true;
    return this.requestService.post('payments/publishDebin', publishDebinRequest);
  }

  getPaymentHistory(cuit: string, productCode: string): Observable<PaymentHistory[]> {
    return this.requestService.get(`payments/getPaymentsHistory?clientCuit=${cuit}&productCode=${productCode}`);
  }

  getReceipt(buId, docId, legalEntityId): Observable<any> {
    return this.requestService.get(`payments/getReceipt?buId=${buId}&docId=${docId}&legalEntityId=${legalEntityId}`);
  }

  getUnappliedPayments(cuit: string, productCode: string): Observable<UnappliedPayment[]> {
    return this.requestService.get(`payments/getUnappliedPayments?clientCuit=${cuit}&productCode=${productCode}`);
  }

  getInvoice(trxId, facElect): Observable<any> {
    return this.requestService.get(`payments/getInvoice?trxId=${trxId}&facElect=${facElect}`);
  }

  getAdvanceFeeOrders(): Observable<AdvanceFeeResponse[]> {
    return this.requestService.get('payments/GetAdvanceFeeOrders');
  }

  changeAdvanceFeeOrdersStatus(ids: number[], status: EAdvanceFeeStatus): Observable<any> {
    this.isRequesting = true;
    return this.requestService.put(`payments/ChangeAdvanceFeeOrdersStatus?status=${status}`, ids);
  }

  postOrderAdvanceFee(orderAdvanceFeeList: OrderAdvanceFee[] ): Observable<any> {
    this.isRequesting = true;
    return this.requestService.post('payments/OrderAdvanceFee', orderAdvanceFeeList);
  }

  getGetAllPublishedDebtFiles(): Observable<PublishedDebtFile[]> {
    return this.requestService.get('payments/getAllPublishedDebtFiles');
  }

  getBUListForClient(): Observable<Array<String>> {
    return this.requestService.get('payments/getBUListForClient');
  }

  postInformPayments(reportPayments: InformPayments): Observable<any> {
    this.isRequesting = true;
    return this.requestService.post('payments/ReportPayments', reportPayments);
  }

  getCvuEntities(payload): Observable<CvuEntity[]>{
    return this.requestService.get('payments/GetCvuEntities', payload);
  }

  GetAllRenditionReport(): Observable<ReporteRendiciones[]>{
    return this.requestService.get('payments/GetAllPaymentMethods');
  }

  getPaymentDetailByPaymentMethodId(id: number): Observable<ReportPaymentDetail[]>{
    return this.requestService.get(`payments/GetPaymentDetailsByPaymentMethodId?paymentMethodId=${id}`);
  }

  informPaymentMethodDoneManual(payload: InformDebin[]) {
    return this.requestService.post('Payments/InformPaymentMethodDoneManual', payload);
  }

  getAllDebines(params?: string): Observable<any> {
    return this.requestService.get(!params ? 'Payments/GetAllDebines' : `Payments/GetAllDebines?${params}`);
  }

  getAllUsersFromDebines(): Observable<User[]> {
    return this.requestService.get('Payments/GetAllUsersFromDebin');
  }

  getPaymentReportsByDate(fromDate: Date, toDate: Date): Observable<PaymentReport[]> {

    let params = new HttpParams();
    if(fromDate){
      params = params.append('fromDate', new Date(fromDate).toISOString());
    };
    if(toDate){
      params = params.append('toDate', new Date(toDate).toISOString());
    }
    return this.requestService.get('Payments/GetPaymentReportsByDate', params);
  }

  getAllClientsOnDebtFree(): Observable<DebtFree[]>{
    return this.requestService.get('payments/GetDebtFreeForNotify');
  }

  postFreeDebtEmail(payload: DebtFree): Observable<any>{
    return this.requestService.post('payments/SendDebtFreeNotification', payload);
  }
}
