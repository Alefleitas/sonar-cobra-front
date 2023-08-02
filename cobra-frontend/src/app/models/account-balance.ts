import { Communication } from './communication';
import { Role, BusinessUnits } from '.';

export class AccountBalance {
    id: number;
    businessUnit: string;
    client: AccountBalanceUser;
    communications: Array<Communication>;
    product: string;
    totalDebtAmount: number;
    futurePaymentsCount: number;
    futurePaymentsAmountUSD: number
    overduePaymentDate?: string;
    overduePaymentsCount: number;
    overduePaymentsAmountUSD: number;
    salesInvoiceAmountUSD: number;
    paidPaymentsCount: number;
    paidPaymentsAmountUSD: number;
    department: EDepartment;
    balance: EBalance;
    delayStatus: EDelayStatus;
    contactStatus: EContactStatus;
    publishDebt: EPublishDebt;
    workStarted: EWorkStarted;
}

export enum EDepartment {
    CuentasACobrar = 0,
    Legales = 1,
    Externo = 2
}

export enum EBalance {
    AlDia = 0,
    Mora = 1
}

export enum EDelayStatus {
    Negociacion = 0,
    CartaDocumento = 1,
    Juicio = 2,
    Incobrable = 3
}

export enum EContactStatus {
    NoContactado = 0,
    Contactado = 1
}

export class AccountBalanceUser {
    id: string;
    firstName:string;
    lastName: string;
    email: string;
    birthDate:Date;
    aditionalCuits: Array<string>;
    businessUnits?: Array<BusinessUnits>;
    roles: Array<Role>;
    cuit: string;
  }

  export enum EPublishDebt {
    No = "N",
    Si = "Y"
}

export enum EWorkStarted {
    No = "N",
    Si = "Y"
}