import { EAdvanceFeeStatus } from "./summary-advance";

export class AdvanceFeeResponse {
  id: number;
  codProducto: string;
  clientCuit: string;
  razonSocial: string;
  solicitante: string;
  vencimiento: Date;
  moneda: string;
  importe: number;
  saldo: number;
  createdOn: Date;
  status: EAdvanceFeeStatus;
  updatedStatus?: EAdvanceFeeStatus;
}
