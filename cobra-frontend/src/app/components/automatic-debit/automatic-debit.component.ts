import { Component, OnInit, ViewChild, TemplateRef, } from '@angular/core';
import { AutomaticDebitService } from 'src/app/services/automatic-debit.service';
import { MatDialog } from '@angular/material/dialog';
import { Property, Currency, AccountBank, ECurrency } from 'src/app/models';
import { AutomaticPayment, AutomaticPaymentItem, AutomaticPaymentNew } from 'src/app/models/automatic-payment';
import { PropertyService } from 'src/app/services/property.service';
import { AccountService } from 'src/app/services/account.service';
import { PrincipalService } from '../../core/auth';
import * as _ from 'lodash';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';

export interface Options {
  value: number;
  viewValue: string;
}
@Component({
  selector: 'app-automatic-debit',
  templateUrl: './automatic-debit.component.html',
  styleUrls: ['./automatic-debit.component.scss']
})
export class AutomaticDebitComponent implements OnInit {
  automaticDebits: AutomaticPayment[];
  payConfi: boolean;
  payTable: boolean;
  dialogCont : boolean;
  isLoading: boolean = true;
  index: number;
  property: Property;
  properties: any[];
  automaticDebitDS: AutomaticPaymentItem[] = [];
  bankAccounts: AccountBank[] = [];
  selectedAutomaticDebit: AutomaticPaymentItem;
  currentUser: any;
  newAP: AutomaticPaymentItem;

  constructor(
    private automaticDebitService: AutomaticDebitService,
    private propertyService: PropertyService,
    private accountService: AccountService,
    private principalService: PrincipalService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.payConfi = false;
    this.payTable = true;
    this.automaticDebitService.getAutomaticPayments().subscribe((ap: AutomaticPayment[]) => {
      this.automaticDebits = ap;
      this.propertyService.getPropertyCodes().subscribe((props: any) => {
        this.properties = _.map(props, p => {
          p['mixedEmpAndCode'] = `${p.emprendimiento} | ${p.productCode}`;
          return p;
        });
        this.accountService.getAccounts().subscribe((ba: AccountBank[]) => {
          this.bankAccounts = ba;
          this.principalService.getIdentity().subscribe((user: any) => {
            this.currentUser = user;
            this.formatData();
            this.isLoading = false;
          });
        });
      });
    });
  }

  formatData() {
    this.automaticDebitDS = _.sortBy(_.map(this.properties, prop => {
      let AD: AutomaticPayment = _.find(this.automaticDebits, (ad: AutomaticPayment) => ad.product === prop.productCode);
      let ADI = {
        id: AD ? AD.id : undefined,
        user: this.currentUser.userEmail,
        name: this.currentUser.firstName,
        entrepreneurship: prop.mixedEmpAndCode,
        productCode: prop.productCode,
        client: this.currentUser.cuit,
        currency: AD ? AD.currency === 0 ? 'ARS' : 'USD' : '',
        cbu: AD ? AD.bankAccount.cbu : '',
        companyCuit: prop.cuitEmpresa,
        adhereDebit: AD ? true : false
      }
      return ADI;
    }), ad => ad.entrepreneurship);
  }

  updateAutomaticPaymentsDS() {
    this.isLoading = true;
    this.automaticDebitService.getAutomaticPayments().subscribe((ap: AutomaticPayment[]) => {
      this.automaticDebits = ap;
      this.formatData();
      this.isLoading = false;
    }, err => {
      window.alert('ERROR! ' + err.message);
      this.isLoading = false;
    });
  }

  /*openPay(): void {
    // this.router.navigate(['pay-configuration/{{this.propertyId}}/{{this.total}}']);
    this.payTable = false;
  }*/

  conFigHight(ap: AutomaticPaymentItem) {
    this.property = new Property();
    this.property.cuitCompany = ap.companyCuit;
    this.newAP = ap;

    this.payConfi = true;
    this.payTable = false;
  }

  conFigLow(ap: AutomaticPaymentItem) {
    this.isLoading = true;
    this.automaticDebitService.cancelAutomaticPayment(Number(ap.id)).subscribe(res => {
      this.payTable = false;
      this.payConfi = false;
      this.automaticDebitDS = [];
      this.openDialogLowRequest();
      this.updateAutomaticPaymentsDS();
    }, err => {
      window.alert('ERROR! ' + err.message);
      this.isLoading = false;
    });
  }

  conFigBtn(data: any) {
    if(data) {
      this.isLoading = true;
      let altaAP: AutomaticPaymentNew = {
        payerId: this.currentUser.userId,
        bankAccountId: data.id,
        currency: data.currency,
        product: this.newAP.productCode
      };

      this.automaticDebitService.newAutomaticPayment(altaAP).subscribe(x => {
        this.updateAutomaticPaymentsDS();
        this.payConfi = false;
        this.payTable = true;
      }, err => {
        window.alert('Error! ' + err.message);
      });
    } else {
      this.payConfi = false;
      this.payTable = true;
      this.isLoading = false;
    }
  }

  openDialogLowRequest(): void {
      const dialogRef = this.dialog.open(DialogInfoComponent, {
        maxWidth: '300px',
        panelClass: 'dialog-responsive',
        data: {
          title: 'Confirmación de baja de débito',
          text: 'El débito automático fue correctamente cancelado.',
          icon: 'check_circle',
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.payConfi = false;
        this.payTable = true;
      });
  }
}
