export class Summary {
  orden: number;
  cuit: string;
  idCuentaCorriente: string;
  fecha: string;
  comprobanteTipo: string;
  comprobante: string;
  moneda: string;
  debe: number;
  haber: number;
  saldo: number;
  unidad: string;
  tipoOperacion: string;
  reciboTipo: string;
  reciboImporte: string;
  reciboImporteAplicado: string;
  capital: string;
  intereses: string;
  trxId: string;
  facElect: string;
  trxNumber: string;

  check?: boolean;
  onDebtDetail?: boolean;
  processing?: boolean;

}
