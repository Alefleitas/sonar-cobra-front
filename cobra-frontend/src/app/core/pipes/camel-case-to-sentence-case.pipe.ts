import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'camelCaseToSentenceCase'
})
export class CamelCaseToSentenceCasePipe implements PipeTransform {

  transform(value: string): any {
    return _.startCase(value);
  }

}
