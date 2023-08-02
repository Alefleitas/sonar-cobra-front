export class SummaryAdvance {
  status: EAdvanceFeeStatus;
  createdOn: string | null;
  orden: string;
  cuit: string;
  requestedByCuit?: string;
  idCuentaCorriente: string;
  fecha: string;
  comprobanteTipo: string;
  comprobante: string;
  moneda: string;
  debe: string;
  haber: string;
  saldo: string;
  unidad: string;
  tipoOperacion: string;
  reciboTipo: string;
  reciboImporte: string;
  reciboImporteAplicado: string;
  intereses: string;
  capital: string;
  trxId: string;
  facElect: string;
  trxNumber: string;
  producto: string;
  check?: boolean;
  onDebtDetail?: boolean;
  autoApproved?: boolean;
}

export enum EAdvanceFeeStatus {
  NoSolicitado,
  Pendiente,
  Aprobado,
  Rechazado
}
