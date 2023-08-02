import { Currency } from './currency';

export class Property {
  id?: number;
  name?: string;
  address?: string;
  lotNumber?: number;
  price?: number;
  idCurrency?: number;
  currency?: Currency;
  nroComprobante?: string;
  nroCliente?: string;
  cuitCompany?: string;
  nroCuitCliente?: string;
  formatedFileName?: string;
  timeStamp?: string;
  productCode?: string;
  emprendimiento?: string;
  mixedEmpAndCode?: string;
  razonSocial?: string;
}
