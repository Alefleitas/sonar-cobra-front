import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountBank } from 'src/app/models/account-bank';
import { AccountService } from 'src/app/services/account.service';
import { RelationService } from 'src/app/services/relation.service';
import { toaster } from 'src/app/app.component';
import { PrincipalService } from 'src/app/core/auth/principal.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { DialogTermsComponent } from '../shared/dialog-terms/dialog-terms.component';
import { TermsConditions } from '../shared/dialog-terms/termsConditions';
import { RelationtStubs } from 'src/app/services/stubs/relation.stubs';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';

@Component({
  selector: 'app-dialog-add-account',
  templateUrl: './dialog-add-account.component.html',
  styleUrls: ['./dialog-add-account.component.scss'],
  providers: [
    {
      provide: RelationService,
      useClass: RelationtStubs
    }
  ]
})
export class DialogAddAccountComponent implements OnInit {

  bimoneda: string = "072";
  currencyPesos = '0';
  isShown: boolean = true;
  isBimoneda : boolean = false;
  relations: any;
  formInfoAccountBank: FormGroup;

  validationResult: string;
  validationDni: string;
  iconValidation: string;
  isValidAccount: boolean;

  currentUser: any;
  isFormLoading: boolean;
  cargaDeArchivo: boolean;
  cargaDeRelaciones: boolean;
  selectDeRelaciones: any;
  
  constructor(
    private accountService: AccountService,
    private principalService: PrincipalService,
    private relationService: RelationService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogAddAccountComponent>,
  ) { }

  ngOnInit(): void {
    this.cargaDeArchivo = false;
    this.cargaDeRelaciones = false;
    this.isFormLoading = false;
    this.isValidAccount = false;
    this.principalService.getIdentity().subscribe(resp => {
      this.currentUser = resp;
    });
    this.relationService.getRelations().then((res: any) => {
      this.relations = res.data;
    });
    this.defineFormGroup();
  }

  defineFormGroup() {
    this.formInfoAccountBank = this.formBuilder.group({
      cuit: ['', [Validators.required]],
      cbu: ['', [Validators.required]],
      currency: ['']
    });
  }

  closePopUp(action: string): void {
    this.dialogRef.close(action);
  }
  
  validateCbu() {

    this.isFormLoading = true;
    const cbuPost: AccountBank = new AccountBank();
    this.validationResult = '';
    this.validationDni = '';
    this.iconValidation = '';

    this.isValidAccount = false;
    /* this.fileToUpload = null; */
    this.selectDeRelaciones = undefined;
    this.cargaDeArchivo = false;
    this.cargaDeRelaciones = false;

    cbuPost.cbu = this.formInfoAccountBank.value.cbu;
    cbuPost.cuit = this.formInfoAccountBank.value.cuit;

    this.accountService.validateCbu(cbuPost).subscribe(
      res => {
        if (res.validacion == 'CBU_OK') {
          if (!this.isBimoneda && (res.currency != this.formInfoAccountBank.value.currency)) {
            this.isValidAccount = false;
            this.iconValidation = 'error';
            this.validationResult = 'CBU no corresponde con la moneda.';
          } else {
            if (this.verificarQueSeaPropietarioDeCuil(res.cuit)) {
              this.isValidAccount = true;
            } else {
              this.activarCargaDeArchivoYRelaciones();
            }
            this.iconValidation = 'check_circle';
            this.validationResult = `CUIT y CBU Validado > ${res.denominacionCuit}`;
            this.validationDni = `DNI: ${res.cuit.substr(2, 8)}`;
          }
        } else {
          this.isValidAccount = false;
          this.iconValidation = 'error';
          this.validationResult = 'CBU no corresponde con el Cuit.';
        }
        this.isFormLoading = false;
      },
      error => {
        toaster.error(
          'La información enviada es incorrecta o esta desactualizada',
          'No se realizó validación de CBU'
        );
        this.isFormLoading = false;
      }
    );
  }

  verificarQueSeaPropietarioDeCuil(cuit: string): boolean {
    return JSON.parse(this.currentUser.aditionalCuits).includes(cuit);
  }

  activarCargaDeArchivoYRelaciones() {
    this.cargaDeArchivo = true;
    this.cargaDeRelaciones = true;
  }

  validarRelacionYArchivo() {
    if (this.selectDeRelaciones !== undefined) {
      this.isValidAccount = true;
      this.cargaDeArchivo = false;
      this.cargaDeRelaciones = false;
    }
  }

  validateBiMoneda(event: any){
    if (event.target.value.startsWith("072")){
      this.isShown =false;
      this.isBimoneda=true;
      this.formInfoAccountBank.get('currency').clearValidators(); // 6. Clear All Validators
      this.formInfoAccountBank.get('currency').updateValueAndValidity();

    }else{
      this.isShown = true;
      this.isBimoneda=false;
      this.formInfoAccountBank.get('currency').setValidators([Validators.required]); // 5.Set Required Validator
      this.formInfoAccountBank.get('currency').updateValueAndValidity();
    }
  }

  clickEvtCbu(e) {
    e.preventDefault();
    this.openDialogTemsCbu();
  }

  openDialogTemsCbu(): void {
    this.dialog.open(DialogTermsComponent, {
      maxWidth: '600px',
      panelClass: 'dialog-responsive',
      data: {
        title: 'Terminos y Condiciones',
        message: this.text('30716989093'), // VER ESTO!! -> this.property.cuitCompany
        btn: 1
      }
    });
  }

  text(bank) {
    switch (bank) {
      case '30715720902':
        return TermsConditions.dataPuertoMadero;
      case '30587480359':
        return TermsConditions.dataConsultatioSA;
      case '30658660892':
        return TermsConditions.dataNordelta;
      case '30709054038':
        return TermsConditions.dataNAFSA;
      case '30505454436': // Criba
        return TermsConditions.dataCribaSA;
      case '30716989093': // Huergo use terms and conditions from ConsultaTio
        return TermsConditions.dataConsultatioSA;
    }
  }

  // addAccount(): void {
  //   this.isFormLoading = false;
  //   this.isValidAccount = false;
  //   this.cargaDeArchivo = false;
  //   this.cargaDeRelaciones = false;
  //   this.defineFormGroup();
  // }

  cancelAccoun(action: string): void {
    this.validationResult = '';
    this.validationDni = '';
    this.iconValidation = '';

    this.isValidAccount = false;
    this.selectDeRelaciones = undefined;
    this.cargaDeArchivo = false;
    this.cargaDeRelaciones = false;
    this.closePopUp(action);
  }

  createNewAccount() {
    this.isFormLoading = true;
    this.postBankAccount();
    this.validationResult = '';
    this.validationDni = '';
    this.iconValidation = '';
  }

  postBankAccount() {
    const cbuPost: AccountBank = new AccountBank();

    cbuPost.cbu = this.formInfoAccountBank.value.cbu;
    cbuPost.cuit = this.formInfoAccountBank.value.cuit;
    cbuPost.currency = this.isBimoneda ? this.currencyPesos : this.formInfoAccountBank.value.currency;

    this.accountService.postAccountBank(cbuPost).subscribe(
      res => {
        this.isFormLoading = false;
        this.cancelAccoun("success");
        this.openDialogUpCbu();

      },
      error => {
        this.isFormLoading = false;
        this.cancelAccoun("error");
        toaster.error(
          error.status == 302 ? 'El CBU ya existe para el cliente' : 'La información enviada es incorrecta o esta desactualizada',
          'No se realizó el alta de CBU',
        );
      }
    );
  }

  openDialogUpCbu(): void {
    this.dialog.open(DialogInfoComponent, {
      maxWidth: '300px',
      panelClass: 'dialog-responsive',
      data: {
        title: 'Alta de CBU',
        text: 'Se realizo correctamente el alta de CBU.',
        icon: 'check_circle',
      }
    });
  }

}
