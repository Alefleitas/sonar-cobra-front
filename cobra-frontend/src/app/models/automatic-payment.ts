import { User } from './user';
import { Currency } from './currency';
import { AccountBank } from './account-bank';

export class AutomaticPayment {
    id: string;
    payer: User;
    currency: number;
    bankAccount: AccountBank;
    product: string;
}

export interface AutomaticPaymentNew {
    payerId: string;
    bankAccountId: number;
    currency: number;
    product: string;
}

export interface AutomaticPaymentItem {
    id?: string;
    user: User;
    name: string;
    entrepreneurship: string;
    productCode: string;
    client: string;
    currency: string;
    cbu: string;
    companyCuit?: string;
    adhereDebit: boolean;
}
