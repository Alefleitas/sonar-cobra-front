import { Currency } from "./currency";

export class CvuEntity {
    Id: number;
    ItauCreationTransactionId: string;
    CvuValue: string;
    Alias: string;
    AccountBalanceId: number;
    Currency: Currency;
}