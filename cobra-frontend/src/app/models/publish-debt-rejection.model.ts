import { ErrorDebtRejection } from "./error-debt-rejection.model";

export class PublishDebtRejection {

    id: number;
    publishDebtRejectionFileId: number;
    empresa: string;
    ultimaRendicionProcesada: number;
    nroCliente: string;
    cuitCliente: string;
    moneda: string;
    nroCuota: number;
    tipoComprobante: string;
    nroComprobante: string;
    errors: ErrorDebtRejection[];
}
