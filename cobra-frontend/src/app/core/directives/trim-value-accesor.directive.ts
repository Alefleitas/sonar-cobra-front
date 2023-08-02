import { Directive, HostListener, forwardRef } from '@angular/core';
import { DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const TRIM_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TrimValueDirective),
  multi: true
};

/**
 * The trim accessor for writing trimmed value and listening to changes that is
 * used by the {@link NgModel}, {@link FormControlDirective}, and
 * {@link FormControlName} directives.
 */
@Directive({
   // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[trim-value]',
  providers: [TRIM_VALUE_ACCESSOR]
})
export class TrimValueDirective extends DefaultValueAccessor {

  @HostListener('input', ['$event.target.value'])
  ngOnChange = (val: string): void => {
    this.onChange(val.trim());
  };

  @HostListener('blur', ['$event.target.value'])
  applyTrim(val: string): void {
    this.writeValue(val.trim());
  }

  writeValue(value: any): void {
    if (typeof value === 'string') {
      value = value.trim();
    }

    super.writeValue(value);
  }

}
