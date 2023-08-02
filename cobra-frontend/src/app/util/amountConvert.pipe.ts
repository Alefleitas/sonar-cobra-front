import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'amountConvert' })
export class AmountConvert implements PipeTransform {
    //imp: importe, args[0]: moneda, args[1]: viene arreglado?
    transform(imp: number | string, ...args: any[]): string {
        let currency = args[0];
        let num = 0;
        imp = imp ? imp : 0; //en caso de que sea null, undefined, o vacío, lo reemplazo con 0
        if (typeof imp === 'string')
            num = args[1] ? parseFloat(imp) : parseFloat(imp) / 100;
        else
            num = args[1] ? imp : imp / 100;
        let amount = num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".").replace(/.([^.]*)$/, ',' + '$1');
        let currSymbol = '';
        if (currency) {
            currSymbol = `${(currency === 'USD' || currency === '2' || currency === 2) ? 'US$' : '$'}`;
            return `${currSymbol} ${amount}`;
        } else
            return amount;
    }
}

export function amountConvertTool(imp: number | string, moneda: string, fixed: boolean): any {
    let currency = moneda;
    let num = 0;
    if (typeof imp === 'string')
        num = fixed ? parseFloat(imp) : parseFloat(imp) / 100;
    else
        num = fixed ? imp : imp / 100;
    let amount = num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".").replace(/.([^.]*)$/, ',' + '$1');
    let currSymbol = '';
    if (currency) {
        currSymbol = `${(currency === 'USD' || currency === '2') ? 'US$' : '$'}`;
        return `${currSymbol} ${amount}`;
    } else
        return amount;
}

export function amountWithDecimalsConvertTool(imp: number | string, moneda: string, fixed: boolean): any {
    let currency = moneda;
    let num = 0;
    if (typeof imp === 'string')
        num = fixed ? parseFloat(imp.replace(',', '.')) : parseFloat(imp) / 100;
    else
        num = fixed ? imp : imp / 100;
    let amount = num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".").replace(/.([^.]*)$/, ',' + '$1');
    let currSymbol = '';
    if (currency) {
        currSymbol = `${(currency === 'USD' || currency === '2') ? 'US$' : '$'}`;
        return `${currSymbol} ${amount}`;
    } else
        return amount;
}