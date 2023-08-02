import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { API, APIDefinition, Columns, Config, STYLE, THEME } from 'ngx-easy-table';
import { toaster } from 'src/app/app.component';
import { EPermission, PaymentHistory, Property, UnappliedPayment, User } from 'src/app/models';
import { EAdvanceFeeStatus, SummaryAdvance } from 'src/app/models/summary-advance';
import { SummaryService } from 'src/app/services/summary.service';
import * as _ from 'lodash';
import { PrincipalService } from 'src/app/core/auth';
import { PropertyService } from 'src/app/services/property.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ComponentActionDialog, DialogInfoComponent } from '../dialog-info/dialog-info.component';
import { PaymentService } from 'src/app/services/payment.service';
import { OrderAdvanceFee } from 'src/app/models/order-advance-fee.model';
import { SupportService } from 'src/app/services/support.service';

@Component({
  selector: "app-advance-payments",
  templateUrl: "./advance-payments.component.html",
  styleUrls: ["./advance-payments.component.scss"],
})
export class AdvancePaymentsComponent implements OnInit, ComponentActionDialog {
  @ViewChild("table") table: APIDefinition;
  @ViewChild("table") summaryTable: APIDefinition;
  @ViewChild("amount") amount: TemplateRef<any>;
  @ViewChild("action") action: TemplateRef<any>;

  isLoading: boolean;
  lockBtnLoading: boolean = false;
  paymentAlreadyRequested: boolean = false;
  missingPayments: boolean = false;
  disableButtons: boolean = false;
  lockAdvancePayments: boolean = false;
  showNothing: boolean = false;
  eAdvanceFeeStatus = EAdvanceFeeStatus;

  cuits: string[] = [];
  filteredCuits: string[] = [];
  properties: Property[] = [];
  propertiesOrg: Property[] = [];
  filteredProperties: Property[] = [];

  selectedCuit: string;
  selectedProperty: string;

  paymentsHistory: PaymentHistory[] = [];
  unappliedPayments: UnappliedPayment[] = [];
  summarys: SummaryAdvance[] = [];

  isEmpty: boolean;

  currentDate: Date;
  currentUser: User;
  userAllowedToLock: boolean = false;
  selectedEmp: string;

  selectedProduct: Property;

  toggledRows = new Set<number>();

  codigoMoneda: string;
  total: number;

  configurationBalance: Config = {
    additionalActions: false,
    checkboxes: false,
    clickEvent: true,
    collapseAllRows: false,
    detailsTemplate: false,
    draggable: false,
    exportEnabled: false,
    fixedColumnWidth: true,
    groupRows: false,
    headerEnabled: true,
    horizontalScroll: false,
    isLoading: false,
    logger: false,
    orderEnabled: true,
    orderEventOnly: false,
    paginationEnabled: false,
    paginationMaxSize: 5,
    paginationRangeEnabled: true,
    persistState: false,
    resizeColumn: false,
    rows: 10,
    searchEnabled: false,
    selectCell: false,
    selectCol: false,
    selectRow: false,
    serverPagination: false,
    showContextMenu: false,
    showDetailsArrow: false,
    tableLayout: {
      style: STYLE.NORMAL,
      theme: THEME.LIGHT,
      borderless: false,
      hover: true,
      striped: false,
    },
  };

  columnsBalance = [
    {
      key: "fecha",
      title: "Vencimiento",
      width: "20%",
      cssClass: { 'name': 'Vencimiento', 'includeHeader': false }
    },
    {
      key: "moneda",
      title: "Moneda",
      width: "20%",
      cssClass: { 'name': 'Moneda', 'includeHeader': false }
    },
    {
      key: "amount",
      title: "Importe",
      width: "20%",
      cssClass: { 'name': 'Importe', 'includeHeader': false }
    },
    {
      key: "action",
      title: "Adelantar",
      width: "20%",
      cssClass: { 'name': 'Adelantar', 'includeHeader': false }
    },
  ];

  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private propertyService: PropertyService,
    private principalService: PrincipalService,
    private summaryService: SummaryService,
    private paymentService: PaymentService,
    private supportService: SupportService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.total = 0;
    this.isLoading = true;

    this.supportService.getLockAdvancePayments().subscribe(x => {
      this.lockAdvancePayments = x;

      this.principalService.getIdentity().subscribe((user: User) => {
        this.currentUser = _.cloneDeep(user);
        this.userAllowedToLock = this.currentUser.userRoles.some(x => x.permissions.some(z => z.code === EPermission.Lock_AdvancePayments))
        //@ts-ignore
        this.cuits = JSON.parse(this.currentUser.aditionalCuits);

        if (!this.checkLock()) {
          this.selectedCuit = this.currentUser.cuit + ' | ' + this.currentUser.firstName;
          this.getCuentaCorrientes();
        } else {
          this.isLoading = false;
        }
      });
    }, err => {
      window.alert('ERROR: No se ha podido traer la información del servidor');
      this.showNothing = true;
      this.isLoading = false
    })
  }

  ngAfterViewInit() {
    _.forEach(this.columnsBalance, (col) => {
      if (col.key === "amount") col["cellTemplate"] = this.amount;
      if (col.key === "action") col["cellTemplate"] = this.action;
    });
  }

  ngAfterViewChecked() {
    const data_labels = document.querySelectorAll("tbody tr td");
    Array.from(data_labels).forEach(x => {
      x.classList.remove("ng-star-inserted")
      x.classList.remove("no-results")
    })
  }

  cleanTables() {
    this.summarys = new Array<SummaryAdvance>();
    this.paymentsHistory = new Array<PaymentHistory>();
    this.unappliedPayments = new Array<UnappliedPayment>();
    this.total = 0;
  }

  cleanSelections() {
    this.selectedEmp = "";
    this.selectedProperty = "";
    this.selectedCuit = this.cuits[0];
    this.disableButtons = false;
    this.paymentAlreadyRequested = false;
  }

  eventEmitter(event) {
    if (event.event === "onPagination" || event.event === "customEvent") {
      if (this.toggledRows.size > 0) {
        this.toggledRows.forEach((item) => {
          this.table.apiEvent({
            type: API.toggleRowIndex,
            value: item,
          });
          this.toggledRows.delete(item);
        });
      }
    }
  }

  checkTotal(): boolean {
    return Math.trunc(this.total) == 0;
  }

  openConfirmDialog() {
    let summarysConfirm = this.summarys.filter((s) => s.check);

    let datesConfirm = '';
    summarysConfirm.forEach(s => {
      datesConfirm += s.fecha + '<br />';
    });

    let text = `Adelantar cuotas: <br /><br /> ${datesConfirm}`;

    this.dialog.open(DialogInfoComponent, {
      maxWidth: "600px",
      panelClass: "dialog-responsive",
      data: {
        icon: "arrow_forward",
        text: text,
        negativeButton: "Cancelar",
        positiveButton: "Confirmar",
        componentAction: this,
      },
    });
  }

  actionPositive() {
    this.isLoading = true;
    this.disableButtons = true;

    let summarysConfirm = this.summarys.filter((s) => s.check);

    let orderAdvanceFeeList = summarysConfirm.map((summ) => {
      let expiration = moment(summ.fecha, "DD/MM/YYYY").format("YYYY-MM-DD");

      let moneda = undefined;
      if (summ.moneda === "ARS") {
        moneda = 0;
      } else if (summ.moneda === "USD") {
        moneda = 2;
      }

      let o = new OrderAdvanceFee();
      o.cuit = this.selectedCuit.split(" | ")[0];
      o.codProducto = this.selectedProduct.productCode;
      o.vencimiento = expiration;
      o.importe = Number(summ.capital);
      o.moneda = moneda;
      o.saldo = Number(summ.saldo);
      return o;
    });

    
    this.paymentService.postOrderAdvanceFee(orderAdvanceFeeList).pipe(
      finalize(() => {
        this.isLoading = false;
        this.cleanTables();
        this.cleanSelections();
      })
    ).subscribe(
      (res: any) => {

        // Si el cliente ya solicitó adelanto, incluso si pido sólo una cuota más, se tiene que mostrar "pendiente de aprobación"
        if (orderAdvanceFeeList.length == 1) {

          const text = "Solicitud confirmada.<br />Dentro de las 24hs hábiles podrás abonar<br />esta cuota en la sección <a href='/#/payments'>Pagar</a>.";
          this.dialog.open(DialogInfoComponent, {
            maxWidth: '600px',
            panelClass: 'dialog-responsive',
            data: { icon: 'check_circle', text: text }
          });

        } else {
          const text = "Como solicitaste adelantar más de una cuota,<br />la operación está pendiente de aprobación.<br /><br />Dentro de las próximas 24hs hábiles, ingresa a la sección <a href='/#/payments'>Pagar</a> y consulta si tu pedido fue autorizado.";
          this.dialog.open(DialogInfoComponent, {
            maxWidth: '600px',
            panelClass: 'dialog-responsive',
            data: { icon: 'info', text: text }
          });
        }

      },
      error => {
        
        toaster.error(
          `Póngase en contacto con su administrador para obtener más información: ${error.message}`,
          'Error '
        );
      }

    );

  }

  actionNegative() { }

  getCuentaCorrientes() {
    this.isLoading = true;
    this.propertyService
      .getPropertyCodesForAdvance()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (res: any) => {
          this.propertiesOrg = res;
          _.forEach(this.propertiesOrg, (prop) => {
            prop[
              "mixedEmpAndCode"
            ] = `${prop.emprendimiento} | ${prop.productCode}`;
          });
          this.properties = _.sortBy(
            _.cloneDeep(this.propertiesOrg),
            (prop) => prop.mixedEmpAndCode
          );
          this.cuits = _.map(
            _.uniqBy(this.properties, (p) => p.nroCuitCliente),
            (pr) => pr.nroCuitCliente + ' | ' + pr.razonSocial
          );
          this.filteredCuits = _.cloneDeep(this.cuits);
          this.selectedCuit = this.filteredCuits[0];
          this.filterCuentasByCuit(this.selectedCuit);
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          toaster.error(
            `Póngase en contacto con su administrador para obtener más información: ${error.message}`,
            "Error "
          );
        }
      );
  }

  filterCuentasByCuit = (cuit: string) => {
    this.cleanTables();
    this.missingPayments = false;

    this.properties = _.sortBy(
      _.cloneDeep(
        _.filter(this.propertiesOrg, (c) => cuit.includes(c.nroCuitCliente))
      ),
      (prop) => prop.mixedEmpAndCode
    );
    this.filteredProperties = _.cloneDeep(this.properties);

    this.selectedEmp = "";
    this.selectedProperty = "";
  };

  getPaymentsSummary(mixedEmpAndCode: string) {
    this.cleanTables();
    this.eventEmitter({ event: "customEvent" });
    this.toggledRows.clear();
    this.isLoading = true;
    this.missingPayments = false;
    this.paymentAlreadyRequested = false;

    let property = _.find(
      this.properties,
      (p) => p.mixedEmpAndCode === mixedEmpAndCode
    );

    this.selectedProduct = property;

    this._resetPagination();

    this.summaryService.GetPaymentsForAdvance(property.nroCuitCliente, property.productCode, this.selectedCuit.split(" | ")[0]).subscribe(
      (res: any) => {
        this.isLoading = false;
        if (res) {
          // Chequear cuotas vencidas (previas al día de la fecha) que tengan saldo positivo.
          // Chequear cuotas que no son del mes vigente, que estén publicando deuda y tengan saldo positivo
          // En caso positivo (hay saldo pendiente) -> inhabilitar AC
          let cuotasAdeudadas = _.filter(res, (summ) =>
            Number(summ.saldo) > 0 && (this.chequearCuotaPasada(summ.fecha) || (!this.chequearCuotaPresente(summ.fecha) && summ.onDebtDetail))
          );
          if (cuotasAdeudadas.length > 0) {
            this.missingPayments = true;
            this.dialog.open(DialogInfoComponent, {
              maxWidth: '600px',
              panelClass: 'dialog-responsive',
              data: {
                icon: "info",
                text: "Regularice su saldo pendiente para poder solicitar adelantos de cuotas",
              },
            });
            return;
          }

          // Obtener cuotas con saldo positivo y que tengan vencimiento a futuro (descontando el mes vigente)
          this.summarys = _.filter(res, x => Number(x.saldo) > 0 && this.chequearCuotaFutura(x.fecha));



          // Si con el cuit seleccionado ya se hizo alguna solicitud de adelanto (que fue informada pero aún no otorgada - o sea, no está aún en archivo de deuda), se bloquea la funcionalidad
          const cuotasSolicitadas = this.summarys.filter(x => [EAdvanceFeeStatus.Pendiente, EAdvanceFeeStatus.Aprobado].includes(x.status) && this.selectedCuit.includes(x.requestedByCuit));


          //Validar que no se haya solicitado el adelanto de una sola cuota, en ese caso se auto aprueba la cuota
          //Si la cuota es auto aprobada, validar la fecha vigente, no debe pedir hasta el mes siguiente.
          const cuotasAutoAprobadas = cuotasSolicitadas.filter(x =>
            x.status === EAdvanceFeeStatus.Aprobado &&
            this.selectedCuit.includes(x.requestedByCuit) &&
            moment(x.createdOn).month() === moment().month() &&
            x.autoApproved
          );

          if (cuotasAutoAprobadas.length > 0) {
            this.paymentAlreadyRequested = true;
            this.dialog.open(DialogInfoComponent, {
              maxWidth: '600px',
              panelClass: 'dialog-responsive',
              data: {
                icon: "info",
                text: "No podrá solicitar adelanto de cuotas ya que el titular seleccionado realizó una petición de una sola cuota y fue aprobada automaticamente para el mes vigente.<br /><br />Se le habilitará de nuevo en el siguiente mes.",
              },
            });
          } else if (cuotasSolicitadas.length > 0) {
            this.paymentAlreadyRequested = true;
            this.dialog.open(DialogInfoComponent, {
              maxWidth: '600px',
              panelClass: 'dialog-responsive',
              data: {
                icon: "info",
                text: "No podrá solicitar adelanto de cuotas pues el titular seleccionado ya tiene una petición en proceso.<br /><br />Se le habilitará de nuevo en cuanto se haya registrado el pago.",
              },
            });
          }

          // Obtener cuotas que no estén publicando deuda y mostrar sólo las tres primeras cuotas
          // Mostrar cuotas YA solicitadas sólo en caso de que el cuit seleccionado lo haya hecho ('cuotasSolicitadas').
          // Mostrar cuotas NO solicitadas aún por el cuit seleccionado (no han sido informadas, están en null)
          this.summarys = _.slice(
            _.sortBy(
              this.summarys.filter(x => !x.onDebtDetail && (cuotasSolicitadas.length > 0 ? this.selectedCuit.includes(x.requestedByCuit) || [EAdvanceFeeStatus.NoSolicitado, EAdvanceFeeStatus.Rechazado].includes(x.status) : this.selectedCuit.includes(x.requestedByCuit) || [EAdvanceFeeStatus.NoSolicitado, EAdvanceFeeStatus.Rechazado].includes(x.status)))
              , e => moment(e.fecha, "DD/MM/YYYY")
            )
            , 0, 3);

          this.summarys.forEach(summ => {
            summ.check = false;
          });

          this.codigoMoneda = this.summarys.length > 0 ? this.summarys[0].moneda : '';
        }
      },
      (error) => {
        this.isLoading = false;
        toaster.error(
          `Póngase en contacto con su administrador para obtener más información: ${error.message}`,
          "Error "
        );
      }
    );
  }

  changeValue(index: any, event: any) {
    event.preventDefault();

    if (this.summarys[index].check === false) {
      for (let i = index; i >= 0; i--) {
        if (this.summarys[i].check === false && [EAdvanceFeeStatus.NoSolicitado, EAdvanceFeeStatus.Rechazado].includes(this.summarys[i].status)) {
          this.summarys[i].check = true;
          this.total += Number(this.summarys[i].capital);
        }
      }
    } //Si estoy destildando
    else {
      for (let i = index; i < this.summarys.length; i++) {
        if (this.summarys[i].check === true) {
          this.summarys[i].check = false; //se tildan todas las posteriores
          this.total -= Number(this.summarys[i].capital);
        }
      }
    }
  }

  chequearCuotaPasada(fec) {
    var today = moment();
    return moment(fec, "DD/MM/YYYY").isBefore(today);
  }

  chequearCuotaPresente(fec) {
    var today = moment();
    return moment(fec, "DD/MM/YYYY").isSame(today, 'month');
  }

  chequearCuotaFutura(fec) {
    var today = moment();
    return moment(fec, "DD/MM/YYYY").isAfter(today, 'month');
  }

  _resetPagination() {
    this.summaryTable.apiEvent({
      type: API.setPaginationCurrentPage,
      value: 1,
    });
  }

  formateDate(date: string) {
    return moment(date.slice(0, 10), "YYYY-MM-DD").format("DD/MM/YYYY")
  }

  checkLock() {
    const user = this.currentUser.userRoles.length == 1 && this.currentUser.userRoles[0].name == "cliente";
    return user && this.lockAdvancePayments;
  }

  setLockAdvancePayments() {
    this.lockBtnLoading = true;
    this.supportService.setLockAdvancePayments(!this.lockAdvancePayments).subscribe(x => {
      this.lockAdvancePayments = x;
      this.lockBtnLoading = false;
    }, err => {
      window.alert('ERROR: No se ha podido modificar la (in)habilitación de Adelanto de Cuotas');
      this.lockBtnLoading = false
    })
  }
}
