import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ActivatedRoute, Router } from '@angular/router';

import { AccountService } from 'src/app/services/account.service';
import { RelationService } from 'src/app/services/relation.service';
import { RelationtStubs } from 'src/app/services/stubs/relation.stubs';

import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AccountBank } from 'src/app/models';
import { DialogTermsComponent } from './../../shared/dialog-terms/dialog-terms.component';
import { PrincipalService } from 'src/app/core/auth';
import { TermsConditions } from './../../shared/dialog-terms/termsConditions';
import { DialogInfoComponent } from '../../dialog-info/dialog-info.component';
export interface Options {
  value: number;
  viewValue: string;
}
export interface Relations {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-confir-auto-debits',
  templateUrl: './confir-auto-debits.component.html',
  styleUrls: ['./confir-auto-debits.component.scss'],
  providers: [
    {
      provide: RelationService,
      useClass: RelationtStubs
    }
  ]
})
export class ConfirAutoDebitsComponent implements OnInit {
  sub: any;
  accounts: any;
  relations: any;
  cbu: string;
  result: any;
  idProperty: number;
  amount: number;
  formInfoAccountBank: FormGroup;
  currentDate: Date;
  srcResult: any;
  filename: any;
  SelectFile: boolean;
  disabledCuenta: boolean;
  dialogCont: boolean;
  checkedTerm: boolean;
  selectedAccount: AccountBank;
  @Input() bankAccounts: AccountBank[];
  @Input() property: any;
  @Output() eventBtn: EventEmitter<any>;
  @Input() data: any;
  @Input() index: any;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private accountService: AccountService,
    private relationService: RelationService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private principalService: PrincipalService,
    private cookieService: CookieService
  ) {
    this.currentDate = new Date();
    this.eventBtn = new EventEmitter<any>();
  }
  selectCuenta: number = 0;
  checked: boolean = false;
  newAccount: boolean;

  ngOnInit() {
    this.accounts = this.bankAccounts;
    this.newAccount = false;
    this.relationService.getRelations().then((res: any) => {
      this.relations = res.data;
    });
    this.defineFormGroup();
    this.SelectFile = true;
    this.dialogCont = false;
  }


  clickEvt(e) {
    e.preventDefault();
    this.openDialogTems();
  }

  disabledButtonPagar(): boolean {
    if (this.checkedTerm === true && this.selectCuenta != null && this.selectCuenta != 0) {
      return false;
    } else {
      return true;
    }
  }

  openDialog(): void {
    this.dialog.open(DialogInfoComponent, {
      maxWidth: '450px',
      panelClass: 'dialog-responsive',
      data: {
        title: 'Alta de CUIT',
        text: 'Estamos analizado el nuevo CUIT ingresado. Cuando el tramite haya finalizado recibirá una confirmación por correo electrónico.',
        icon: 'check_circle'
      }
    });
    this.newAccount = false;
    this.checkedTerm = false;
    this.cbu = null;
  }

  selectCBU(cbu) {
    this.selectedAccount = cbu;
  }

  accept() {
    this.eventBtn.emit(this.selectedAccount);
  }

  cancel() {
    this.eventBtn.emit(false);
  }

  convert64(event: any) {
    const f = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (theFile: any) => {
      const base64String = window.btoa(theFile.target.result);
      this.filename = event.target.files[0].name;
    };
    reader.readAsBinaryString(f);
    this.SelectFile = false;
  }

  openDialogPay(): void {
    const dialogRef = this.dialog.open(DialogInfoComponent, {
      maxWidth: '450px',
      panelClass: 'dialog-responsive',
      data: {
        title: 'Confirmación de solicitud de débito',
        text: 'Recibirás un correo electrónico para finalizar la operación y confirmar la solicitud de débito desde tu homebanking.',
        icon: 'check_circle'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.eventBtn.emit(true);
    });
    this.newAccount = false;
    this.checkedTerm = false;
    this.cbu = null;
  }

  uppNewAccount() {
    let actDialog: boolean = true;
    /* this.accountService.postAccountBank(this.formInfoAccountBank.value).then((result)=>{
      this.openDialog();
    }, function(err){
      console.log(err);
    }); */
    this.formInfoAccountBank.get('cbu').setValue("");
    this.SelectFile = true;
    this.filename = null;
    this.disabledCuenta = false;
  }


  defineFormGroup() {
    this.formInfoAccountBank = new FormGroup({
      id: new FormControl(4),
      cbu: new FormControl('', Validators.required),

    });
  }

  addAccount(): void {
    this.newAccount = true;
    this.checkedTerm = false;
    this.selectCuenta = 0;
    this.disabledCuenta = true;
    this.defineFormGroup();
  }

  cancelAccoun(): void {
    this.newAccount = false;
    this.disabledCuenta = false;
  }

  payment() {

    /* this.paymentService.postPaymentsArray(this.payments).then((res: any) => {
    }); */

    this.openDialogPay();
    this.dialogCont = true;

  }
  cancelPay() {
    this.eventBtn.emit(false);
    this.dialogCont = true;
  }

  openDialogTems(): void {
    const dialogRef = this.dialog.open(DialogTermsComponent, {
      maxWidth: '600px',
      panelClass: 'dialog-responsive',
      data: {
        title: 'Terminos y Condiciones',
        message: this.text(this.property.cuitCompany),
        btn: 2
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result === 1) {
        this.checkedTerm = true;
      } else {
        this.checkedTerm = false;
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
    }
  }

}
