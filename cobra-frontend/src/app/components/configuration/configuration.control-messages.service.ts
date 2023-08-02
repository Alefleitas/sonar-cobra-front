import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidationService } from './configuration.validation.service';

@Component({
  selector: 'control-messages',
  styleUrls: ['./configuration.component.scss'],
  template: `<div style="color: red" *ngIf="errorMessage !== null">{{errorMessage}}</div>`
})
export class ControlMessagesComponent {
  @Input() control: FormControl;
  constructor() { }

  get errorMessage() {
    for (const propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        return this.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }
    return null;
  }

  getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    const config = {
      required: 'Requerido',
      minlength: `Debe contener minimo ${validatorValue.requiredLength} caracteres.`,
    };

    return config[validatorName];
  }

}
