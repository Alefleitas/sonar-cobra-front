import { Injectable } from '@angular/core';
import { PaymentDetail } from 'src/app/models/payment-detail';
@Injectable({
    providedIn: 'root'
})
export class PaymentDetailsStub {
    paymentDetails: Array<PaymentDetail> = [
        {
            id: 4,
            accountBalanceId: 3,
            fechaPrimerVencimiento: new Date(2020, 5, 23),
            codigoMoneda: 'USD',
            importePrimerVenc: 1000,
            importePrimerVencUSD: 1000,
            saldoActual: 1000,
            saldoActualUSD: 1000
        }
    ]

    getPaymentDetails(accountBalanceId): Promise<Array<PaymentDetail>> {
        return new Promise((resolve, reject) => {
            resolve(this.paymentDetails.filter(cDetail => cDetail.accountBalanceId == accountBalanceId));
        });
    }
}