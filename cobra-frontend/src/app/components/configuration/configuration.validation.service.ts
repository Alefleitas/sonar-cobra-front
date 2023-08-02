export class ValidationService {
  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    const config = {
      required: 'Requerido',
      invalidPassword: 'Debe contener al menos un número, una letra mayúscula y un carácter especial.',
      minlength: `Debe contener minimo ${validatorValue.requiredLength} caracteres.`,
    };

    return config[validatorName];
  }



  static passwordValidator(control: any) {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    ///^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/
    if (control.value.match(/^(?=.*[0-9])(?=.*?[/#.:_|!?()¡¿"=@$%^&*-+])(?=.*?[A-Z])[a-zA-Z0-9!@#$%^&*].{6,100}$/)) {
      return null;
    } else {
      return { invalidPassword: true };
    }
  }

 /*  static checkPasswords(control) { // here we have the 'passwords' group
    let pass = control.get('nowPassword').value;
    let confirmPass = control.get('confirmPassword').value;
    return pass === confirmPass ? null : { notSame: true }
  } */
}
