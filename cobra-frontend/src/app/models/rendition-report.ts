import { ECurrency } from "./currency";
import { EPaymentInstrument, EPaymentSource, EPaymentStatus, EPaymentType } from "./payment";
import { User } from "./user";

export class ReporteRendiciones {
    id: number;
    payer: User;
    amount: number;
    currency: ECurrency;
    transactionDate: Date;
    source: EPaymentSource;
    status: EPaymentStatus;
    instrument: EPaymentInstrument;
    type?: EPaymentType; // SubInstrument
    operationId: string;
    olapAcuerdo: string;
    hasPaymentDetail?: boolean;
}

export class ReportPaymentDetail {
    id: number;
    subOperationId: string;
    creditingDate: Date;
    instrument: string;
    amount: number;
    status: string;
    errorDetail: string;
}