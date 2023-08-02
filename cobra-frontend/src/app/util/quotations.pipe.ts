import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';

@Pipe({ name: 'quotationPipe' })
export class QuotationPipe implements PipeTransform {
    transform(value: any) {
        switch(typeof value) {
            case 'string':
                //regex checks for a date, otherwise is normal text
                return /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01]).*$/.test(value) ? moment(value).format('DD/MM/YYYY HH:mm') : _.startCase(value);
            case 'number':
                return value.toFixed(2);
            default:
                return value;
        }
    }
}