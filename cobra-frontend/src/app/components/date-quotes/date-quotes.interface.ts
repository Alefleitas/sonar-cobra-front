
export interface QuotationExternal {
    id: number;
    description: string;
    uploadDate?: Date;
    effectiveDateFrom: Date;
    effectiveDateTo: Date;
    userId: string;
    rateType: string;
    fromCurrency: string;
    toCurrency: string;
    valor: number;
    source: number;
    storedInDb?: boolean;
    filteredByDate?: Date;
    especie?: string;
  }
  
  export interface QuotationsInput {
    quotationsOrigen: QuotationExternal[];
    generatedQuotations: QuotationExternal[];
  }