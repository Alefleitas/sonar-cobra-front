export class PublishDebinRequest {
  compradorCuit?: string;
  compradorCbu?: string;
  compradorRazonSocial?: string;
  vendedorCbu?: string;
  vendedorCuit?: string;
  comprobantes?: Array<string>;
  fechaVencimiento?: string;
  horaVencimiento?: string;
  importe?: string;
  moneda?: number;
  debtAmounts?: Array<DebtAmount>;
}



export class DebtAmount {
  debtId: number;
  amount: number; 
}