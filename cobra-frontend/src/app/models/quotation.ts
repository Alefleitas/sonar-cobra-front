export class DolarMEP {
    id?: number;
    bonoDolar: number;
    bonoPeso: number;
    description: string;
    uploadDate?: Date;
    effectiveDateFrom: Date;
    effectiveDateTo: Date;

    constructor(source) {
        Object.assign(this, source);
    }
}

export class USD {
    id?: number;
    uploadDate?: Date;
    effectiveDateFrom: Date;
    effectiveDateTo: Date;
    valor: number;

    constructor(source) {
        Object.assign(this, source);
    }
}

export class UVA {
    id?: number;
    uploadDate?: Date;
    effectiveDateFrom: Date;
    effectiveDateTo: Date;
    valor: number;

    constructor(source) {
        Object.assign(this, source);
    }
}

export class CAC {
    id?: number;
    uploadDate?: Date;
    effectiveDateFrom: Date;
    effectiveDateTo: Date;
    valor: number;

    constructor(source) {
        Object.assign(this, source);
    }
}

export class CACUSD {
    id?: number;
    uploadDate?: Date;
    effectiveDateFrom: Date;
    effectiveDateTo: Date;
    valor: number;

    constructor(source) {
        Object.assign(this, source);
    }
}


export const quotationClasses = {
    'DolarMEP': DolarMEP,
    'USD': USD,
    'UVA': UVA,
    'CAC': CAC,
    'CACUSD': CACUSD
}

export class QuotationList {
    code: string;
    data: any;
}