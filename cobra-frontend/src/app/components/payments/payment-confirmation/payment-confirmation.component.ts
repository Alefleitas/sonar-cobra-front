import { catchError, finalize, tap } from 'rxjs/operators';
import { DialogTermsComponent } from './../../shared/dialog-terms/dialog-terms.component';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import {Clipboard} from '@angular/cdk/clipboard';
import { MatDialog } from '@angular/material/dialog';

import { AccountService } from 'src/app/services/account.service';

import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { PaymentService } from 'src/app/services/payment.service';
import { AccountBank, Currency, DebtAmount, Payment, Property, PublishDebinRequest } from 'src/app/models';
import { TermsConditions } from './../../shared/dialog-terms/termsConditions';
import { AuthService, PrincipalService } from 'src/app/core/auth';
import { toaster } from 'src/app/app.component';
import { Product } from '../payments.component';
import { DialogInfoComponent } from '../../dialog-info/dialog-info.component';
import { DialogAddAccountComponent } from '../../dialog-add-account/dialog-add-account.component';
import { AppConfigService } from 'src/app/core/config/AppConfigService';
import { EMedioDePago, InformPayments } from 'src/app/models/payment';
import { CvuEntity } from 'src/app/models/cvu-entity';
import {MatSnackBar} from '@angular/material/snack-bar';
import { IStepOption, TourService } from 'ngx-ui-tour-md-menu';
import { MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'app-payment-confirmation',
  templateUrl: './payment-confirmation.component.html',
  styleUrls: ['./payment-confirmation.component.scss'],
})
export class PaymentConfirmationComponent implements OnInit {
  bimoneda: string = "072";
  accounts: Array<AccountBank>;
  currentDate: Date;
  disabledCuenta: boolean;
  checkedTerm: boolean;
  publishDebinRequest: PublishDebinRequest;
  isLoading: boolean  = false;
  disableCBU: boolean  = false;
  total: number;

  tooltip: boolean = true;
  @Input()
  tooltipHelp: any;

  @Input()
  payments: any;
  @Input()
  property: any;
  @Input()
  alreadyInformed: any;
  @Output()
  eventData: EventEmitter<any>;
  @Output()
  eventBtn: EventEmitter<any>;

  @Input()
  paymentsSelected: Map<Product, Array<Payment>>;
  @Input()
  codigoMoneda: string;

  availableMediosPagos: EMedioDePago[];
  medioPago: EMedioDePago;
  showDEBIN: boolean = false;
  showCVU: boolean = false;
  showECHEQ: boolean = false;
  sendingInformar: boolean = false;
  validReportPayment: boolean = false;
  CVUpayload: any;
  loadingCVU: boolean = false;
  CVUNotFound: boolean = true;
  CVU: string = "";

  isTourRunning: boolean = false;
  hideBanners: boolean = false;

  constructor(
    public dialog: MatDialog,
    private accountService: AccountService,
    private paymentService: PaymentService,
    private principalService: PrincipalService,
    private cdr: ChangeDetectorRef,
    private appConfigService: AppConfigService,
    private clipboard: Clipboard,
    private _snackBar: MatSnackBar,
    private tourService: TourService,
    public mediaObserver: MediaObserver
  ) {
    this.currentDate = new Date();
    this.eventData = new EventEmitter<any>();
    this.eventBtn = new EventEmitter<any>();
    this.total = 0;
  }
  selectCuenta: string = null;

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  ngOnInit() {
    this.isLoading = true;
    this.CVU = "";
    this.getAccounts();
    this.calculateTotals();
    this.isLoading = false  

    this.availableMediosPagos = this.appConfigService.getConfig().mediosDePago.filter(x => {
      // @ts-ignore
      if (EMedioDePago[x] === EMedioDePago.CvuOperation) {
        let productosBU = [];
        this.paymentsSelected.forEach(x => {
          productosBU.push(x[0].archivoDeuda.header.organismo.cuitEmpresa);
        })
        productosBU = [...new Set(productosBU)]
        
        let aceptadosBU = this.appConfigService.getConfig().buAceptadosCVU ? this.appConfigService.getConfig().buAceptadosCVU : [];
        return productosBU.some(y => aceptadosBU.includes(y))
      }
      return true
    });

  }

  getAccounts() {
    this.accounts = new Array<AccountBank>();
    this.accountService.getAccounts()
      .subscribe(
        (res: any) => {
          res.forEach(element => {
            if (element.currency === Number(this.codigoMoneda) || element.cbu?.startsWith(this.bimoneda)) {
              if(!this.accounts.find(x=> x.cbu === element.cbu)) this.accounts.push(element);
            }
          });
        },
        error => console.log(error)
      );
  }

  updateAccounts(){
    this.disableCBU = true;
    this.getAccounts();
    this.disableCBU = false;
  }

  calculateTotals() {
    this.total = 0;
    this.paymentsSelected.forEach((payments, prod) => {
      payments.forEach(pay => {
        if (pay.pay) {
          this.total += pay.importePrimerVenc;
        }
      });
    });
  }

  removePayment(index: number, prod: Product) {
    if (index == 0) {
      this.paymentsSelected.delete(prod);
    } else {
      let payments = this.paymentsSelected.get(prod);
      payments[index].pay = false;
      payments[index - 1].lastCheck = true;
    }
    this.calculateTotals();
  }

  openDialogPay(): void {
    const dialogRef = this.dialog.open(DialogInfoComponent, {
      maxWidth: '450px',
      panelClass: 'dialog-responsive',
      data: {
        title: 'Confirmación de solicitud de débito',
        text: 'Para finalizar la operación y deberás confirmar la solicitud de débito desde tu homebanking.',
        icon: 'check_circle',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.eventData.emit(true);
      this.eventBtn.emit(true);
    });
    this.checkedTerm = false;
  }

  addAccount(): void {
    this.isLoading = false;
    this.checkedTerm = false;
    this.selectCuenta = null;
    this.disabledCuenta = true;

    const dialogRef = this.dialog.open(DialogAddAccountComponent, {
      maxWidth: '600px',
      panelClass: 'account-dialog-responsive',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") this.updateAccounts();
      this.disabledCuenta = false;
    });
   }
  
  payment() {
    this.isLoading = true;

    this.publishDebinRequest = new PublishDebinRequest();
    this.publishDebinRequest.compradorCbu = this.selectCuenta;
    this.publishDebinRequest.vendedorCuit = this.property.cuitEmpresa;
    this.publishDebinRequest.importe = this.total?.toString();
    this.publishDebinRequest.moneda = +this.codigoMoneda;
    this.publishDebinRequest.debtAmounts = new Array<DebtAmount>();
    this.publishDebinRequest.comprobantes = new Array<string>();

    this.paymentsSelected.forEach((payments, prod) => {
      this.publishDebinRequest.comprobantes.push(prod.name);
      payments.forEach(pay => {
        if (pay.pay) {
          let debtAmount = new DebtAmount();
          debtAmount.debtId = pay.id;
          debtAmount.amount = pay.importePrimerVenc;
          this.publishDebinRequest.debtAmounts.push(debtAmount);
        }
      });
    });

    if (!this.paymentService.isRequesting) {
      this.paymentService.postPayments(this.publishDebinRequest).subscribe(
        res => {
          this.openDialogPay();
          this.paymentService.isRequesting = false;
          this.isLoading = false;
        },
        error => {
          toaster.error(
            'La información enviada es incorrecta o está desactualizada',
            'No se realizó el pago'
          );
          this.paymentService.isRequesting = false;
          this.isLoading = false;
        }
      );
    }
  }

  reportPayment(){
    this.sendingInformar = true;
    let producto;
    let reportPayments = new InformPayments();
    reportPayments.ReportDate = new Date()
    reportPayments.Amount = this.total;
    reportPayments.Currency = parseInt(this.codigoMoneda);
    reportPayments.Type = this.medioPago;

    reportPayments.DebtIds = [];
    this.paymentsSelected.forEach((payments, prod) => {
      producto = prod.name
      reportPayments.Product = prod.name;
      reportPayments.Cuit = payments[0].nroCuitCliente;
      payments.forEach(pay => {
        if (pay.pay) {
          reportPayments.DebtIds.push(pay.id);
        }
      });
    });

    this.paymentService.postInformPayments(reportPayments).subscribe(
      (res: any) => {
      this.sendingInformar = false;
      this.alreadyInformed = true;
        toaster.success(
          `Se ha informado correctamente el pago asociado al producto ${producto}`,
          'Éxito '
        );
      },
      error => {
        console.log(error)
        this.sendingInformar = false;
        toaster.error(
          `Ha ocurrido un error al intentar informar el pago.`,
          'Error '
        );
      }
    );


  }

  // VENTANA DE TERMINOS Y CONDICIONES
  openDialogTems(): void {
    const dialogRef = this.dialog.open(DialogTermsComponent, {
      maxWidth: '600px',
      panelClass: 'dialog-responsive',
      data: {
        title: 'Terminos y Condiciones',
        message: this.text(this.property.cuitEmpresa),
        btn: 2
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.checkedTerm = true;
      } else {
        this.checkedTerm = false;
      }
    });
  }

  // TEXTOS DE TERMINOS Y CONDICIONES
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
      case '30716989093': // Huergo use terms and conditions from Consultatio
        return TermsConditions.dataConsultatioSA;
    }
  }

  // TOOLTIPS
  hideTooltip() {
    this.tooltip = false;
  }
  hideTooltipHelp() {
    this.tooltipHelp = false;
  }

  //
  // OTROS
  //

  cancelPay() {
    this.eventData.emit(true);
    if (this.alreadyInformed) this.eventBtn.emit(true);
  }

  clickEvt(e) {
    e.preventDefault();
    this.openDialogTems();
  }

  disabledButtonPagar(): boolean {
    if (this.checkedTerm === true && this.selectCuenta != null && !this.alreadyInformed && !this.isTourRunning) {
      return false;
    } else {
      return true;
    }
  }

  moreThanOneProduct(): boolean {
    return this.paymentsSelected.size !== 1
  }

  disabledButtonInformar(): boolean {
    return this.sendingInformar || this.loadingCVU || this.moreThanOneProduct() || (this.showCVU && (this.checkDolarPayment() || this.CVUNotFound)) || this.isTourRunning
  }

  changeMedioPago(){
    this.tooltip = true;
    this.showDEBIN = this.showCVU = this.showECHEQ = false;

    switch(this.medioPago){
      //@ts-ignore
      case EMedioDePago[EMedioDePago.DEBIN]:
        this.showDEBIN = true;
        break;
      //@ts-ignore
      case EMedioDePago[EMedioDePago.CvuOperation]:
        this.showCVU = true;
        if (!this.CVU) this.getCVU()
        break;
      //@ts-ignore
      case EMedioDePago[EMedioDePago.ECHEQ]:
        this.showECHEQ = true;
        break;
    }
  }

  checkDolarPayment(): boolean {
    return this.codigoMoneda === '2';
  }

  getCVU(){
    this.loadingCVU = true;

    if (this.showCVU && !this.moreThanOneProduct()){
      const payload = {clientCuit: "", producto: ""}
      this.paymentsSelected.forEach((payments, prod) => {
        payload.clientCuit = payments[0].nroCuitCliente
        payload.producto = prod.name
      });
  
      if (this.CVU !== "" && this.CVUpayload === payload){
        return
      }

      this.CVUNotFound = false;
      this.CVUpayload = payload;

      this.paymentService.getCvuEntities(this.CVUpayload).pipe(
        finalize(() => this.loadingCVU = false),
      ).subscribe(
        (res: CvuEntity[]) => {
          if (res.length != 0){
            const filterCVU = res.find(x => x.Currency === Currency[this.codigoMoneda]);
            this.CVU = Object.values(filterCVU)[2];
          } else {
            this.CVU = "";
            this.CVUNotFound = true;
          }
        },
        error => {
          console.log(error)
          this.CVU = "";
          this.CVUNotFound = true;
        }
      )
    }
  }

  copyCVU() {
    this._snackBar.open("¡CVU copiado!", '', {
        panelClass: 'CVUsnackbar',
        duration: 1000
    })
  
    this.clipboard.copy(this.CVU);
  }

  checkTourStyle(){
    if (this.isTourRunning && !this.mediaObserver.isActive('gt-sm')){
      return 'adjustSelectTour'
    }
    return "";
  }

  runTour(){

    this.isTourRunning = this.hideBanners = true;

    const actionBtns = {
      enableBackdrop: true,
      prevBtnTitle: "Atrás",
      nextBtnTitle: "Siguiente",
      endBtnTitle: "Fin"
    }

    let steps: IStepOption[] = [
      {
        anchorId: 'stepSelectMedioPago',
        title: 'Paso 1',
        content: 'Seleccione un medio de Pago. Los medios disponibles son: DEBIN, transferencia a CVU y pago con Echeq. Es posible que alguno de ellos esté deshabilitado temporariamente.',
        ...actionBtns,
      },
      {
        anchorId: 'stepSelectPayments',
        title: 'Paso 2',
        content: 'Aquí puede ver información de las cuotas a pagar. Puede remover cuotas si decide no pagarlas.',
        ...actionBtns,
      },
      {
        anchorId: 'stepCBU',
        title: 'DEBIN - 1',
        content: 'Si seleccionó pago con DEBIN, elija una cuenta bancaria o cargue una nueva.',
        ...actionBtns,
      },
      {
        anchorId: 'stepTyC',
        title: 'DEBIN - 2',
        content: 'Debe aceptar los términos y condiciones de pago con DEBIN',
        ...actionBtns,
      },
      {
        anchorId: 'stepSelectPayments',
        title: 'DEBIN - 3',
        content: 'No olvide aprobar el DEBIN generado en su Homebanking',
        ...actionBtns,
      },
      {
        anchorId: 'stepCVU',
        title: 'CVU',
        content: 'Si seleccionó pago con CVU, aquí puede obtener el código al que transferir el monto total. Recuerde que sólo puede transferir e informar en ARS.',
        ...actionBtns,
        isOptional: true
      },
      {
        anchorId: 'stepCVU-mobile',
        title: 'CVU',
        content: 'Si seleccionó pago con CVU, aquí puede obtener el código al que transferir el monto total. Recuerde que sólo puede transferir e informar en ARS.',
        ...actionBtns,
        isOptional: true
      },
      {
        anchorId: 'stepSelectPayments',
        title: 'CVU / ECHEQ',
        content: 'Si eligió pago con CVU o Echeq, por favor, sólo informe el pago una vez transferido o emitido desde su HomeBanking. Recuerde que sólo puede informar un producto a la vez.',
        ...actionBtns,
      },
      {
        anchorId: 'stepTotal',
        title: 'Paso 3',
        content: 'Aquí puede corroborar el monto total a pagar.',
        ...actionBtns,
      },
      {
        anchorId: 'stepActions',
        title: 'Paso 4',
        content: '¡No olvide de pulsar el botón para confirmar o informar según corresponda!',
        ...actionBtns,
      }
    ]

    this.tourService.initialize(steps); 
    if (this.mediaObserver.isActive('gt-sm')) (document.querySelector("footer") as HTMLInputElement).style.cssText = "display: none;";
    (document.querySelector("app-nav-bar") as HTMLInputElement).style.cssText = "";
    (document.querySelector('mat-sidenav-content') as HTMLInputElement).style.cssText = "overflow-y: hidden";
  

    this.tourService.end$.subscribe(() => {
      this.isTourRunning = false;
      if (this.mediaObserver.isActive('gt-sm')) (document.querySelector("footer") as HTMLInputElement).style.cssText = "display: inline-flex;";
      (document.querySelector("app-nav-bar") as HTMLInputElement).style.cssText = "display: none;";
      (document.querySelector('mat-sidenav-content') as HTMLInputElement).style.cssText = "";

      const self = this;
      setTimeout(function () {
        (document.querySelector("app-nav-bar") as HTMLInputElement).style.cssText = "height: 100%;";
        self.hideBanners = false;
      }, 50);
    });
  
    this.tourService.start()
  }


}