import { AccountBank } from './account-bank';
import { Currency } from './currency';
import { User } from './user';

export class Debin {
  id: number;
  payer: User;
  status: number;
  currency: Currency;
  amount: number;
  transactionDate: Date;
  fechaRecibo?: Date;
  seleccion?: boolean;
}

export class InformDebin {
  id: number;
  fechaRecibo: Date;
}