import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from 'src/app/services/property.service';
import { PaymentService } from 'src/app/services/payment.service';
import { Payment, PaymentInformationBanner } from 'src/app/models/payment';
import { Property } from 'src/app/models/property';
import { Currency } from 'src/app/models/currency';
import { TableFeeComponent } from 'src/app/components/table-fee/table-fee.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService, LoginService, PrincipalService } from 'src/app/core/auth';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/* NgRx */
import { EPermission, ERole } from 'src/app/models';
import { AuthGuard } from 'src/app/core/guards';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import { toaster } from 'src/app/app.component';
import { AppConfigService } from 'src/app/core/config/AppConfigService';
import { IStepOption, TourService } from 'ngx-ui-tour-md-menu';
import { MediaObserver } from '@angular/flex-layout';

export interface Options {
  value: number;
  viewValue: string;
}

export class FilterEmprendimiento {
  emprendimiento: string;
  cuitEmpresa: string;
  nroCuitClientes: string[] = [];
  selectedCuit: string = "";
  nombre: string = "";
}

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit, OnDestroy {
  impoteOriginal: number = -1;
  impoteMod: number = -1;
  editRow: number;
  property: Property;
  properties: Array<Property>;
  propertiesOrg: Array<Property>;
  filteredProperties: Array<Property>;
  payment: Payment;
  payments: Array<Payment>;
  paymentsOriginal: Array<Payment>;
  cuits: Array<string> = [];
  userCuits: Array<string> = [];
  filteredCuits: Array<string> = [];
  selectCuit: string = "Todos";
  paymentsArs: Array<Payment>;
  paymentsUsd: Array<Payment>;
  paymentsArsOriginal: Array<Payment>;
  paymentsUsdOriginal: Array<Payment>;

  paymentsFilter: Array<Payment>;
  paymentsArsFilter: Array<Payment>;
  paymentsUsdFilter: Array<Payment>;
  paymentsArsFilterOrg: Array<Payment>;
  paymentsUsdFilterOrg: Array<Payment>;

  currency: Currency;
  currencies: Array<Currency>;
  currentDate: Date;
  idProperty: number;
  total: number;
  isPaymentConfirmation: boolean = false;
  isLoadingProperties: boolean = false;
  isLoadingPayments: boolean = false;
  moneda: string;
  mostrarPopUp: boolean = false;
  codigoMoneda: number;
  openPop: boolean;
  op: Property;
  selectedEmp: FilterEmprendimiento;
  tooltipHelp: boolean;
  paymentInfoBanners: PaymentInformationBanner[];

  paymentsByProductArs: Map<Product, Array<Payment>>;
  paymentsByProductUsd: Map<Product, Array<Payment>>;
  paymentsByProductSelected: Map<Product, Array<Payment>>;

  @ViewChild('ref') ref: any;
  @ViewChild('refTableArs') refTableArs: TableFeeComponent;
  @ViewChild('refTableUsd') refTableUsd: TableFeeComponent;
  dateLimit: Date;
  dateNow: Date;
  cont: number = 0;
  currentUser: any;

  emprendimientos: Array<FilterEmprendimiento>;
  filteredEmprendimientos: Array<FilterEmprendimiento>;
  emprendimientos_propiedades: Array<string>;
  selectedClientCuit: string;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  isFromSummary: boolean = false;
  readyToPay: any = {};
  successfulReport: boolean = false;

  isTourRunning: boolean = false;
  hideBanners: boolean = false;
  hiddenPanels: boolean = false;

  constructor(
    private propertyService: PropertyService,
    private paymentService: PaymentService,
    private principalService: PrincipalService,
    private cdr: ChangeDetectorRef,
    private loginService: LoginService,
    private authService: AuthService,
    public dialog: MatDialog,
    private authGuard: AuthGuard,
    private appConfigService: AppConfigService,
    private route: ActivatedRoute,
    private tourService: TourService,
    public mediaObserver: MediaObserver
  ) {
    this.currentDate = new Date();
    this.payments = new Array<Payment>();
    this.emprendimientos = new Array<FilterEmprendimiento>();
    this.emprendimientos_propiedades = new Array<string>();
    this.paymentsByProductArs = new Map<Product, Array<Payment>>();
    this.paymentsByProductUsd = new Map<Product, Array<Payment>>();
    this.paymentInfoBanners = new Array<PaymentInformationBanner>();
  }

  get media() {
    return this.mediaObserver;
  };

  ngOnInit() {
    const clientAlertEnabled = this.appConfigService.getConfig().clientAlert.enabled;
    if (this.authService.getValue('ActiveSession') === 'false' && clientAlertEnabled) {
      this.keepLogin();
    }
    this.principalService.getIdentity().subscribe(resp => {
      this.currentUser = _.cloneDeep(resp);
    });

    this.isFromSummary = Boolean(this.route.snapshot.paramMap.get('fromSummary'));

    this.total = 0;
    this.property = new Property();
    this.payment = new Payment();
    this.tooltipHelp = true;

    this.getPaymentInfoBanner();
    this.openPop = true;
    this.dateLimit = new Date('02/25/2020');
    this.dateNow = new Date();
    if (!this.currentUser.popUp) {
      this.datePop();
      this.principalService.SetPopUp(true);
      this.principalService.getIdentity().subscribe(resp => {
        this.currentUser = resp;
      });
    }
    this.appConfigService.showAnnouncements("pagosPendientes");

    this.getUserCuits();
    this.getAllProperties();
    this.getAllPayments();

  }

  updateReadyToPay(service: string) {
    switch (service) {
      case "cuit":
        this.readyToPay.cuit = true;
        break;
      case "property":
        this.readyToPay.property = true;
        break;
      case "payment":
        this.readyToPay.payment = true;
        break;
    }

    if (this.readyToPay?.cuit &&
      this.readyToPay?.property &&
      this.readyToPay?.payment) this.executePaymentFromSummary()
  }

  executePaymentFromSummary() {
    if (this.isFromSummary) {
      const cuit = this.paymentService.selectedPayments.cuit;
      this.filterPropertiesByCuit(cuit);
      const emprendimiento = this.paymentService.selectedPayments.emprendimiento;
      const cuitEmpresa = this.paymentService.selectedPayments.cuitEmpresa;
      const emprendimientoSeleccionado = this.filteredEmprendimientos.find(x => x.nroCuitClientes.includes(cuit) && x.emprendimiento === emprendimiento && x.cuitEmpresa === cuitEmpresa);
      this.filterPaymentsByEmpAndCode(emprendimientoSeleccionado);
      this.setTipodeMoneda(this.paymentService.selectedPayments.moneda === "ARS" ? '0' : '2');
      if (!!this.paymentsByProductSelected) this.openPay();
    }
  }

  getPaymentInfoBanner(): void {
    // @ts-ignore
    const banners = this.appConfigService.getConfig().banners.pagosPendientes;
    for (let i = 0; i < banners.length; i++) {
      this.paymentInfoBanners.push({ id: i, ...banners[i] })
    }
  }

  get isLoading(): boolean {
    return this.isLoadingPayments || this.isLoadingProperties;
  }
  ngOnDestroy(): void {
    // This aborts all HTTP requests.
    this.ngUnsubscribe.next();
    // This completes the subject properlly.
    this.ngUnsubscribe.complete();
  }

  getUserCuits() {
    this.userCuits = new Array<string>();
    this.userCuits.push(...JSON.parse(this.currentUser.aditionalCuits));
    this.userCuits.push(this.currentUser.cuit);
    this.updateReadyToPay("cuit");
  }

  hideTooltip() {
    this.tooltipHelp = false;
    this._fixTableRange();
  }

  hidePaymentInfoBanner(id) {
    this.paymentInfoBanners[id].enabled = false;
    this._fixTableRange();
  }

  openPay(): void {
    this.successfulReport = false;
    this.isPaymentConfirmation = true;
    this.isFromSummary = false;
    this.readyToPay = {};

    let productsDelete = new Array<Product>();
    this.paymentsByProductSelected.forEach((payments, prod) => {
      let remove = true;
      payments.forEach(pay => {
        if (pay.pay) {
          remove = false;
        }
      });
      if (remove) {
        productsDelete.push(prod);
      }
    });

    if (productsDelete.length > 0) {
      productsDelete.forEach(prod => {
        this.paymentsByProductSelected.delete(prod);
      });
    }

  }

  conFig(event: any) {
    if (event === true) {
      this.isPaymentConfirmation = false; // Volver a listado de productos, cancelar pago

      // resetear lista de productos
      this.paymentsFilter = new Array<Payment>();
      this.paymentsArsFilter = new Array<Payment>();
      this.paymentsArsFilterOrg = new Array<Payment>();
      this.paymentsUsdFilter = new Array<Payment>();
      this.paymentsUsdFilterOrg = new Array<Payment>();

      // resetear filtros select

      this.codigoMoneda = undefined;
      this.moneda = undefined;
      this.selectCuit = "Todos";
      this.selectedClientCuit = null;
      this.selectedEmp = undefined;
      this.paymentsByProductSelected = undefined;
      this.total = 0;
    }
  }

  conFigBtn(event: any) {
    if (event === true) {
      this.paymentsFilter = new Array<Payment>();
      this.paymentsArsFilter = new Array<Payment>();
      this.paymentsArsFilterOrg = new Array<Payment>();
      this.paymentsUsdFilter = new Array<Payment>();
      this.paymentsUsdFilterOrg = new Array<Payment>();
      //this.postPaymentsArray(this.payments);
      //this.codigoMoneda=undefined;
      //this.op=undefined;
      this.getAllPayments();
    }
  }

  handleActionRow(event: any) {
    if (event.actualizeTotal) {
      this.total = 0;
      this.paymentsByProductSelected.forEach(x => x.forEach(z => z.pay ? this.total += z.importePrimerVenc : null))
    }
  }


  handleMainCheck(prod: any, event: any) {
    prod.checked = event.checked;
    let amount = 0;
    let payments = this.paymentsByProductSelected.get(prod);

    payments.forEach((pay, idx) => {
      if (event.checked) {

        if (pay.canPay) {
          if (pay.pay) this.total -= pay.importePrimerVenc;
          pay.pay = true;
          amount += pay.importePrimerVenc;
        } else if (pay.pay && pay.lastCheck) {
          amount -= pay.importePrimerVenc;
          pay.importePrimerVenc = pay.importePrimerVencOrig;
          amount += pay.importePrimerVenc;
        }

        if (idx === payments.length - 1) {
          pay.lastCheck = true;
        } else {
          pay.lastCheck = false;
        }
      } else {
        pay.pay = false;
        pay.lastCheck = false;
      }

    });

    if (event.checked) {
      this.total += amount;
    } else {
      this.total -= prod.total;
    }

  }

  checkTotal(): boolean {
    return Math.trunc(this.total) == 0;
  }

  getAllProperties() {
    this.properties = new Array<Property>();
    this.propertiesOrg = new Array<Property>();
    this.filteredProperties = new Array<Property>();
    this.isLoadingProperties = true;

    this.propertyService.getPropertyCodes()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (res: any) => {
          res.forEach(element => {
            this.property = new Property();
            this.property.nroComprobante = element.nroComprobante;
            this.property.cuitCompany = element.cuitEmpresa;
            this.property.nroCuitCliente = element.nroCuitCliente;
            this.property.productCode = element.productCode;
            this.property.emprendimiento = element.emprendimiento;
            this.property.razonSocial = element.razonSocial;
            this.property['mixedEmpAndCode'] = `${this.property.emprendimiento} | ${this.property.productCode}`;
            this.properties.push(this.property);
          });

          this.emprendimientos = _.uniqBy(this.properties, p => [p.emprendimiento, p.cuitCompany].join('')).map(x => {
            let emp = new FilterEmprendimiento();
            emp.emprendimiento = emp.nombre = x.emprendimiento;
            emp.cuitEmpresa = x.cuitCompany;
            emp.nroCuitClientes = [x.nroCuitCliente];
            return emp;
          });

          this.emprendimientos = _.sortBy(this.emprendimientos, x => x.emprendimiento)

          _.forEach(this.properties, x => {
            _.forEach(this.emprendimientos, y => {
              if (x.emprendimiento === y.emprendimiento && y.cuitEmpresa === x.cuitCompany && !y.nroCuitClientes.includes(x.nroCuitCliente))
                y.nroCuitClientes.push(x.nroCuitCliente)
            })
          });

          _.forEach(_.uniqBy(this.emprendimientos, x => x.emprendimiento), y => {
            let checkReapetedEmps = this.emprendimientos.filter(z => z.emprendimiento === y.emprendimiento);
            if (checkReapetedEmps.length > 1) {
              for (let i = 0; i < checkReapetedEmps.length; i++) {
                checkReapetedEmps[i].nombre = this.adjustEmpName(checkReapetedEmps[i].nombre, i);
              }
            }
          });

          this.emprendimientos_propiedades = this.properties.map(e => e.mixedEmpAndCode);

          this.properties = _.sortBy(this.properties, prop => prop.mixedEmpAndCode);

          this.cuits = _.map(_.uniqBy(this.properties, p => p.nroCuitCliente), pr => pr.nroCuitCliente + " | " + pr.razonSocial);

          if (!this._isAdmin() && !this._isComercial() && this.userCuits.length < 2) {
            this.filterPropertiesByCuit(this.currentUser.cuit);
          }
          this.filteredEmprendimientos = _.cloneDeep(this.emprendimientos);
          this.filteredCuits = _.cloneDeep(this.cuits);
          this.propertiesOrg = this.properties;
          this.filteredProperties = _.cloneDeep(this.propertiesOrg);
          this.isLoadingProperties = false;

          this.updateReadyToPay("property");
        },
        error => {
          this.isLoadingProperties = false;
          console.log(error);
        }
      );
  }

  getAllPayments() {
    this.paymentsArs = new Array<Payment>();
    this.paymentsUsd = new Array<Payment>();
    this.paymentsArsOriginal = new Array<Payment>();
    this.paymentsUsdOriginal = new Array<Payment>();
    this.isLoadingPayments = true;

    this.paymentService.getPayments()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (res: any) => {
          res.forEach(element => {
            const payment = { ...element };
            payment.importePrimerVenc = this.converAmount(element.importePrimerVenc);
            payment.nroCuota = +element.nroCuota;
            payment.fechaPrimerVenc = moment(payment.fechaPrimerVenc).format('DD/MM/YYYY');
            payment.importePrimerVencOrig = payment.importePrimerVenc;

            if (this.isFromSummary && !this.paymentService.selectedPayments.cuitEmpresa) {
              if (this.paymentService.selectedPayments.producto === payment.obsLibreCuarta)
                this.paymentService.selectedPayments.cuitEmpresa = payment.archivoDeuda.header.organismo.cuitEmpresa;
            }

            payment.canPay = true;
            payment.pay = false;
            payment.lastCheck = false;
            payment.status = 'pending';

            if (payment?.paymentMethod) {
              payment.canPay = false;

              switch (payment.paymentMethod?.status) {
                case 0: case 6: case 10:
                  payment.status = 'processing';
                  break;
                case 1: case 7: case 8:
                  payment.status = 'accepted';
                  break;
                case 2:
                  payment.status = 'rejected';
                  break;
                case 9:
                  payment.status = 'error';
                  break;
                default:
                  payment.canPay = true;
                  break
              }
            } else if (payment?.paymentReportId) {
              payment.status = 'processing';
              payment.canPay = false;
            }

            if (element.codigoMoneda === '0') {
              this.paymentsArs.push(payment);
            } else if (element.codigoMoneda === '2') {
              this.paymentsUsd.push(payment);
            }

          });
          this.total = 0;
          this.cdr.detectChanges();
          if (this.op) {
            this.filterPaymentsByEmpAndCode(this.selectedEmp);
          }
          this.paymentsArsOriginal = [...this.paymentsArs];
          this.paymentsUsdOriginal = [...this.paymentsUsd];
          // this.setUsdExchangeRate(this.paymentsArs);

          this.principalService.getIdentity().subscribe(resp => {
            this.currentUser = resp;
          });

          this.isLoadingPayments = false;
          this.updateReadyToPay("payment");

        },
        error => {
          this.isLoadingPayments = false;
          toaster.error(
            `Póngase en contacto con su administrador para obtener más información: ${error.message}`,
            'Error '
          );
        }
      );
  }

  getDateAsMoment(dateString: string) {
    const date = dateString.includes('.') ? moment(
      dateString.substring(0, dateString.indexOf('.')),
      'YYYYMMDD hh:mm:ss'
    ) : moment(dateString, 'MM/DD/YYYY hh:mm:ss');
    return date;
  }

  converAmount(imp: string): number {
    const num = parseFloat(imp);
    const x = num / 100;
    return x;
  }

  filterPropertiesByCuit(cuitNombre: string) {
    if (this.refTableArs != undefined) {
      this.refTableArs.modify = true;
    }
    if (this.refTableUsd != undefined) {
      this.refTableUsd.modify = true;
    }

    if (cuitNombre === "Todos") {
      this.selectedClientCuit = '';
      this.filteredEmprendimientos = JSON.parse(JSON.stringify(this.emprendimientos));
    } else {
      const cuit = cuitNombre.split(" | ")[0];
      this.selectedClientCuit = cuit;
      this.filteredEmprendimientos = this.emprendimientos.filter(x => x.nroCuitClientes.includes(cuit));
    }

    this.selectedEmp = undefined;
    this.paymentsArsFilter = new Array<Payment>();
    this.paymentsUsdFilter = new Array<Payment>();
    this.total = 0;
    this.setTipodeMoneda(undefined);
    this.moneda = undefined;
    this.paymentsByProductSelected = undefined;

    this.cdr.detectChanges();
  }

  filterPaymentsByEmpAndCode(emprendimiento: FilterEmprendimiento) {

    this.selectedEmp = emprendimiento;
    if (this.selectedClientCuit)
      this.selectedEmp.selectedCuit = this.selectedClientCuit;

    if (this.refTableArs != undefined) {
      this.refTableArs.modify = true;
    }
    if (this.refTableUsd != undefined) {
      this.refTableUsd.modify = true;
    }

    let selectedProducts = this.emprendimientos_propiedades.filter(e => e.includes(this.selectedEmp.emprendimiento));
    if (this.isFromSummary) {
      selectedProducts = selectedProducts.filter(e => e.includes(this.paymentService.selectedPayments.producto))
    }

    this.paymentsArsFilter = JSON.parse(
      JSON.stringify(
        this.paymentsArs.filter(
          pay => !this.selectedClientCuit ?
            pay.archivoDeuda.header.organismo.cuitEmpresa.trim() === this.selectedEmp.cuitEmpresa.trim() &&
            selectedProducts.find(a => a.includes(pay.obsLibreCuarta.trim())) :
            pay.archivoDeuda.header.organismo.cuitEmpresa.trim() === this.selectedEmp.cuitEmpresa.trim() &&
            pay.nroCuitCliente.trim() === this.selectedEmp.selectedCuit.trim() && selectedProducts.find(a => a.includes(pay.obsLibreCuarta.trim()))
        )
      )
    );

    if (this.isFromSummary) {
      this.paymentsArsFilter = this.paymentsArsFilter.filter(pay => this.paymentService.selectedPayments.fechas.includes(pay.fechaPrimerVenc))
    }

    this.groupByProduct(this.paymentsArsFilter, this.paymentsByProductArs);

    this.paymentsUsdFilter = JSON.parse(
      JSON.stringify(
        this.paymentsUsd.filter(
          pay => !this.selectedClientCuit ?
            pay.archivoDeuda.header.organismo.cuitEmpresa.trim() === this.selectedEmp.cuitEmpresa &&
            selectedProducts.find(a => a.includes(pay.obsLibreCuarta.trim())) :
            pay.archivoDeuda.header.organismo.cuitEmpresa.trim() === this.selectedEmp.cuitEmpresa &&
            pay.nroCuitCliente.trim() === this.selectedEmp.selectedCuit.trim() && selectedProducts.find(a => a.includes(pay.obsLibreCuarta.trim()))
        )
      )
    );

    if (this.isFromSummary) {
      this.paymentsUsdFilter = this.paymentsUsdFilter.filter(pay => this.paymentService.selectedPayments.fechas.includes(pay.fechaPrimerVenc))
    }

    this.groupByProduct(this.paymentsUsdFilter, this.paymentsByProductUsd);

    this.paymentsArsFilterOrg = JSON.parse(
      JSON.stringify(this.paymentsArsFilter)
    );
    this.paymentsUsdFilterOrg = JSON.parse(
      JSON.stringify(this.paymentsUsdFilter)
    );

    // this.setUsdExchangeRate(this.paymentsArsFilter);

    this.total = 0;
    this.setTipodeMoneda(undefined);
    this.moneda = undefined;
    this.paymentsByProductSelected = undefined;

    this.cdr.detectChanges();
  }

  getKeyProduct(map: Map<Product, Array<Payment>>, name: string): Product {
    return Array.from(map.keys()).find(key => key.name === name);
  }


  groupByProduct(paymentsFilter: Payment[], paymentsByProduct: Map<Product, Array<Payment>>) {

    paymentsFilter.sort((a, b) => {
      return moment(a.fechaPrimerVenc, 'DD/MM/YYYY').valueOf() - moment(b.fechaPrimerVenc, 'DD/MM/YYYY').valueOf();
    });

    if (this.isFromSummary) {
      this.paymentService.selectedPayments.fechas.sort((a, b) => {
        return moment(a, 'DD/MM/YYYY').valueOf() - moment(b, 'DD/MM/YYYY').valueOf();
      });
    }

    paymentsByProduct.clear();
    paymentsFilter.forEach((pay, index) => {

      pay.pay = false;
      pay.lastCheck = false;
      pay.importePrimerVenc = pay.importePrimerVencOrig;

      if (this.isFromSummary && this.paymentService.selectedPayments.fechas.includes(pay.fechaPrimerVenc) &&
        pay.obsLibreCuarta === this.paymentService.selectedPayments.producto) {

        pay.pay = true;
        if (this.paymentService.selectedPayments.fechas.at(-1) === pay.fechaPrimerVenc) {
          pay.lastCheck = true;
        }
      }

      if (index === paymentsFilter.length - 1) {
        pay.lastCheck = true;
      }

      let product = this.getKeyProduct(paymentsByProduct, pay.obsLibreCuarta.trim());
      if (product !== undefined) {
        if (pay.canPay) product.total += pay.importePrimerVenc;
        paymentsByProduct.get(product).push(pay);
      } else {

        product = new Product();
        product.name = pay.obsLibreCuarta.trim();
        product.checked = false;
        product.total = pay.canPay ? pay.importePrimerVenc : 0;
        product.TC = pay.codigoMonedaTc !== "ARS" && parseFloat(pay.obsLibreTercera) > 1 ? "TC " + pay.codigoMonedaTc + " " + parseFloat(pay.obsLibreTercera) : undefined;

        let payments = new Array<Payment>();
        payments.push(pay);
        paymentsByProduct.set(product, payments);
      }
    });
  }

  setTipodeMoneda(moneda: string) {
    this.codigoMoneda = Number(moneda);
    this.moneda = moneda;

    if (moneda == '0') {
      this.clearPaymentsSelection(this.paymentsByProductUsd);
      this.paymentsByProductSelected = this.paymentsByProductArs;
    } else if (moneda == '2') {
      this.clearPaymentsSelection(this.paymentsByProductArs);
      this.paymentsByProductSelected = this.paymentsByProductUsd;
    }
    this._fixTableRange();
    // this.total = suma;
  }

  clearPaymentsSelection(paymentsByProduct: Map<Product, Array<Payment>>) {
    this.total = 0;
    paymentsByProduct.forEach((payments, prod) => {
      prod.checked = false;
      payments.forEach(pay => {
        pay.pay = false;
        pay.lastCheck = false;
      });
    });
  }

  reLoadpaymentsFilter(event: any) {
    if (this.op)
      this.filterPaymentsByEmpAndCode(this.selectedEmp);
  }

  public postPaymentsArray(p: Array<any>) {
    var payments: Array<Payment> = Object.assign({}, p);
    let cont: number = -1;
    let ult: number = -1;
    let paymentTemp: any;
    let entro: boolean = false;
    Object.values(payments).forEach(element => {
      cont++;
      if (element.pay) {
        ult = cont;
        element.status = 'confirm';
        element.pay = false;
        this.impoteMod = element.importePrimerVenc;
      }
    });
    if (!this.verifyAmount(payments[ult])) {
      entro = true;
      paymentTemp = Object.assign({}, payments[ult]);
      paymentTemp.importePrimerVenc =
        +this.impoteOriginal.toFixed(2) - +this.impoteMod.toFixed(2);
      paymentTemp.importePrimerVenc = +paymentTemp.importePrimerVenc.toFixed(2);
      paymentTemp.pay = false;
      paymentTemp.status = 'pending';
    }
    if (entro) {
      this.payments.push(paymentTemp);
    }
  }

  verifyAmount(payment: Payment): boolean {
    let contPos = -1;
    let temp: boolean;
    let pay: any = payment;

    this.paymentsOriginal.forEach(element => {
      if (
        +element.nroCuota === pay.nroCuota &&
        element.nroComprobante.replace(/ /g, '') ===
        pay.nroComprobante.replace(/ /g, '')
      ) {
        contPos = +element.importePrimerVenc;
        if (+element.importePrimerVenc === pay.importePrimerVenc) {
          temp = true;
        } else {
          temp = false;
        }
      }
    });
    this.impoteOriginal = contPos;
    return temp;
  }


  keepLogin(): void {
    const text = this.appConfigService.getConfig().clientAlert.message;

    const dialogRef = this.dialog.open(DialogInfoComponent, {
      disableClose: true,
      closeOnNavigation: true,
      maxWidth: '600px',
      panelClass: 'dialog-responsive',
      data: {
        text: text,
        icon: 'info',
        positiveButton: 'Confirmar',
        componentAction: {
          actionPositive: () => {
            this.authService.setValue("ActiveSession", "true")
          },
          actionNegative: () => {
            this.loginService.logout();
          }
        }
      }

    });
  }


  openDialog(): void {
    const text = "Nuevo diseño, más intuitivo y organizado. Ahora también permite abonar en dólares en forma inmediata.<br /><br />Se requiere el ingreso al Homebanking para confirmar el débito."

    const dialogRef = this.dialog.open(DialogInfoComponent, {
      maxWidth: '600px',
      panelClass: 'dialog-responsive',
      data: {
        title: 'Novedades',
        text: text,
        icon: 'error',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.openPop = false;
      this.isPaymentConfirmation = false;
    });
  }

  datePop(): void {
    if (this.dateNow <= this.dateLimit) {
      //console.log(this.dateNow <= this.dateLimit);
      this.openDialog();
      this.cont++;
    }
  }

  _isAdmin(): boolean {
    return _.some(this.currentUser.userRoles, r => r.name === 'admin');
  }

  _fixTableRange() {
    setTimeout(() => {
      if (!this.tooltipHelp) {
        let range = <HTMLElement>document.getElementsByClassName('ngx-pagination-range')[0];
        let span = <HTMLElement>document.getElementsByClassName('ngx-pagination-span')[0];
        if (range && span) {
          range.style.top = '150px';
          span.style.top = '155px';
        }
      }
    }, 20);
  }
  canGeneratePayments(): boolean {
    return this.authGuard.isAllowed([EPermission.Generate_Payment], this.currentUser);
  }

  _isComercial(): boolean {
    return _.some(this.currentUser.userRoles, r => r.name.toLowerCase() === ERole[ERole.Comercial].toLowerCase());
  }

  adjustEmpName(name: string, num: number) {
    return `${name}${" - " + String.fromCharCode(65 + num)}`;
  }

  enableCuitFilter() {
    return this._isAdmin() || this._isComercial() || this.cuits.length >= 2
  }

  checkPayments() {
    return ((this.moneda == '0' && !this.paymentsArsFilter?.length) ||
      (this.moneda == '2' && !this.paymentsUsdFilter?.length))
  }

  checkTourStyle() {
    if (this.isTourRunning && !this.mediaObserver.isActive('gt-sm') && this.enableCuitFilter()) {
      return 'adjustFilterTour'
    }
    return "";
  }

  runTour() {

    this.isTourRunning = this.hideBanners = this.hiddenPanels = true;

    const actionBtns = {
      enableBackdrop: true,
      prevBtnTitle: "Atrás",
      nextBtnTitle: "Siguiente",
      endBtnTitle: "Fin"
    }

    let steps: IStepOption[] = [
      {
        anchorId: 'stepCuit',
        content: 'Seleccionar un CUIT para ver sus productos asociados (opcional). Por default se muestran los productos de todos los CUIT a los que el usuario tiene accceso.',
        title: 'Paso 1',
        ...actionBtns,
        isOptional: true,
      },
      {
        anchorId: 'stepProducto',
        content: 'Seleccionar el emprendimiento al que pertenece el o los productos.',
        title: this.enableCuitFilter() ? 'Paso 2' : 'Paso 1',
        ...actionBtns
      },
      {
        anchorId: 'stepMoneda',
        content: 'Seleccionar la moneda con la que desea que aparezcan los montos de las cuotas.',
        title: this.enableCuitFilter() ? 'Paso 3' : 'Paso 2',
        ...actionBtns
      },
      {
        anchorId: 'stepPaymentsContainer',
        content: 'Luego de seleccionar los filtros le aparecerá un listado de productos asociados al emprendimiento. Aquí ofrecemos dos ejemplos, uno con el panel de producto plegado y otro desplegado.',
        title: "Lista de Productos",
        ...actionBtns,
        disablePageScrolling: true,
        disableScrollToAnchor: true,
      },
      {
        anchorId: 'stepClosedPanel',
        content: 'Con esta caja de selección puede elegir si pagar todas las cuotas pendientes del producto o no.',
        title: this.enableCuitFilter() ? 'Paso 4' : 'Paso 3',
        ...actionBtns
      },
      {
        anchorId: 'stepSelectPayments',
        content: 'Cuenta con cajas de selección si desea pagar cuotas específicas. Tenga en cuenta que con cada selección se seleccionarán también las anteriores y con cada deselección se deseleccionarán las posteriores.',
        title: this.enableCuitFilter() ? 'Paso 5' : 'Paso 4',
        ...actionBtns,
        placement: {
          xPosition: 'after',
          yPosition: 'below'
        },
      },
      {
        anchorId: 'stepEdit',
        content: 'La última cuota seleccionada (o si sólo seleccionó una) tendrá la opción de modificar el monto si es que desea hacer un pago parcial.',
        title: this.enableCuitFilter() ? 'Paso 6' : 'Paso 5',
        ...actionBtns
      },
      {
        anchorId: 'stepRefresh',
        content: 'Luego de ingresar el importe a pagar, no olvide de clikear el botón par actualizar el total a pagar. Nota: una vez modificado el importe no podrá seleccionar cuotas posteriores.',
        title: this.enableCuitFilter() ? 'Paso 7' : 'Paso 6',
        ...actionBtns
      },
      {
        anchorId: 'stepPaymentMsg',
        content: 'En la tabla también aparecerá el status de las cuotas que pagó o de las que informó el pago.',
        title: 'Status de Pago',
        ...actionBtns
      },
      {
        anchorId: 'stepTotalPay',
        content: 'Aquí verá el monto total a pagar o informar. Presione el botón "Pagar" para proceder a la pantalla de selección de medio de pago',
        title: this.enableCuitFilter() ? 'Paso 8' : 'Paso 7',
        ...actionBtns,
        isOptional: true,
      },
      {
        anchorId: 'stepTotalPayMobile',
        content: 'Aquí verá el monto total a pagar o informar. Presione el botón "Pagar" para proceder a la pantalla de selección de medio de pago',
        title: this.enableCuitFilter() ? 'Paso 8' : 'Paso 7',
        ...actionBtns,
        isOptional: true,
      }
    ]

    this.tourService.initialize(steps);
    (document.querySelector("app-nav-bar") as HTMLInputElement).style.cssText = "";
    (document.querySelector('mat-sidenav-content') as HTMLInputElement).style.cssText = "overflow-y: hidden";


    this.tourService.end$.subscribe(() => {
      this.isTourRunning = false;
      (document.querySelector('mat-sidenav-content') as HTMLInputElement).style.cssText = "";

      const self = this;
      setTimeout(function () {
        (document.querySelector("app-nav-bar") as HTMLInputElement).style.cssText = "height: 100%;";
        self.hideBanners = false;
        self.hiddenPanels = false;
      }, 250);
    });

    this.tourService.start()
  }
}

export class Product {
  name: string;
  total: number;
  TC: string;
  checked: boolean;
  disabled: boolean;
}
