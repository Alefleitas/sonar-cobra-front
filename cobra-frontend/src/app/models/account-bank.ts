import { Client } from './client';
export class AccountBank {
  id?: number;
  cbu?: string;
  cuit?: string;
  clientCuit?: string;
  currency?: number;
  client?: Client;
  status?: BankAccountStatus;
  validacion?: string;
  denominacionCuit?: string;
}

export enum BankAccountStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2
}
