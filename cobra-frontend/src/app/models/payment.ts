import { Currency } from './currency';
import { Property } from './property';
import { Client } from './client';
import { User } from './user';
import { AccountBank, BankAccountStatus } from './account-bank';
import { CvuEntity } from './cvu-entity';
import { Type } from '@angular/core';

export class Payment {
  id: number;
  description: string;
  status: string;
  dueStatus: string;
  amount: number;
  idClient?: number;
  client?: Client;
  idproperty?: number;
  property?: Property;
  idCurrency?: number;
  currency?: Currency;
  canPay?: boolean;
  pay?: boolean;
  lastCheck?: boolean;

  tipoOperacion: string;
  codigoMoneda: string;
  numeroCliente: string;
  tipoComprobante: string;
  nroComprobante: string;
  nroCuota: number;
  nombreCliente: string;
  direccionCliente: string;
  descripcionLocalidad: string;
  prefijoCodPostal: string;
  nroCodPostal: string;
  ubicManzanaCodPostal: string;
  fechaPrimerVenc: string;
  importePrimerVenc: number;
  fechaSegundoVenc: string;
  importeSegundoVenc: string;
  fechaHastaDescuento: string;
  importeProntoPago: string;
  fechaHastaPunitorios: string;
  tasaPunitorios: string;
  marcaExcepcionCobroComisionDepositante: string;
  formasCobroPermitidas: string;
  nroCuitCliente: string;
  codIngresosBrutos: string;
  codCondicionIva: string;
  codConcepto: string;
  descCodigo: string;
  obsLibrePrimera: string;
  obsLibreSegunda: string;
  obsLibreTercera: string;
  obsLibreCuarta: string;
  codigoMonedaTc: string;
  relleno: string;
  archivoDeuda?: ArchivoDeuda;

  importePrimerVencOrig: number;
  PaymentMethodId: number;
  paymentMethod: PaymentMethod;
  PaymentReportId: number;
  PaymentReport: PaymentReport;
}
export class ArchivoDeuda {
  id: number;
  timeStamp: string;
  formatedFileName: string;
  fileName: string;
  header: any;
  trailer: any;
}

export class PaymentHistory {
  fechaVenc: string;
  moneda: string;
  importe: number;
  saldo: number;
  producto?: string;
  details: PaymentDetail[];
}

export class PaymentDetail {
  tipo: string;
  fecha: string;
  importe: number;
  moneda: string;
  importeFC: number;
  monedaFC: string;
  legalEntityId: string;
  buId: string;
  docId: string;
  docNumber: string;
  applicationType: string;
  trxId: string;
  facElect: string;
  trxNumber: string;
  applTc: string;
  docTc: string;
}

export class UnappliedPayment {
  fecha: string;
  moneda: string;
  operacion: string;
  importe: string;
  importeTc: string;
  conversion: string;
}

export class PaymentInformationBanner {
  id: number;
  enabled: boolean = false;
  text: string;
}

export class SelectedPayments {
  cuit: string;
  emprendimiento: string;
  cuitEmpresa: string;
  producto: string;
  moneda: string;
  fechas: string[];
}

export class PaymentMethod {
  id: number;
  payer: User;
  amount: number;
  currency: Currency;
  debts: Payment[];
  transactionDate: Date;
  source: EPaymentSource;
  status: EPaymentStatus;
  instrument: EPaymentInstrument;
  type: EPaymentType;
  operationId: string;
  creditingDate: Date;

  // DEBIN
  debinCode?: string;
  issueDate?: Date;
  expirationDate?: Date;
  bankAccountId?: number;
  bankAccount?: AccountBank;
  vendorCuit?: string;

  // CVU_OPERATION
  coelsaId?: string;
  cvuEntityId?: number;
  cvuEntity?: CvuEntity;
}

export enum EPaymentSource
{
    Itau = 0,
    Galicia = 1,
    Santander = 2,
    Crypto = 3
}

export enum EPaymentStatus
{
    Pending = 0,
    Approved = 1,
    Rejected = 2,
    Expired = 3,
    Cancelled = 4,
    Error = 5,
    InProcess = 6,
    Finalized = 7,
    InformedManually = 8,
    ErrorInform = 9,
    Informing = 10
}

export enum EPaymentInstrument
{
    DEBIN = 0,
    CVU = 1,
    ECHEQ = 2,
    CASH = 3,
    CHEQUE = 4
}

export enum EPaymentType
{
    // DEBIN
    Normal = 0,
    Recursive = 1,
    // E-CHEQ
    ECHEQ_AL_DIA = 3,
    ECHEQ_CPD = 4
}

export class PaymentReport {
  id: number;
  payerId: string;
  reportDate: Date;
  cuit: string;
  razonSocial: string;
  currency: Currency;
  amount: number;
  debts: Payment[];
  type: EMedioDePago;
  product: string;
  status: EPaymentReportStatus;
  reportDateVto: Date;
}

export class EcheqReport {
  reportDate: string;
  cuit: string;
  razonSocial: string;
  currency: string;
  amount: string;
  type: string;
  product: string;
  status: string;
  reportDateVto: string;
}

export enum EPaymentReportStatus {
  Creado,
  Procesado
}

export enum EMedioDePago {
  DEBIN = 0,
  CvuOperation = 1,
  ECHEQ = 2
}

export class InformPayments {
  ReportDate: Date;
  Cuit: string;
  Currency: number;
  Amount: number;
  DebtIds: number[];
  Type: EMedioDePago;
  Product: string;
}
