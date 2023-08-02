import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild, } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import * as _ from 'lodash';
import { Columns, Config, STYLE, THEME } from 'ngx-easy-table';
import { ECurrency } from 'src/app/models';
import { PaymentService } from 'src/app/services/payment.service';
import { finalize } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { AdvanceFeeResponse } from 'src/app/models/advance-fee-response';
import { EAdvanceFeeStatus } from 'src/app/models/summary-advance';
import { ConfirmOrdersStatusComponent } from './confirm-orders-status/confirm-orders-status.component';
import { toaster } from 'src/app/app.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'app-manage-advance-payments',
  templateUrl: './manage-advance-payments.component.html',
  styleUrls: ['./manage-advance-payments.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ManageAdvancePaymentsComponent implements OnInit {

  @ViewChild("cuotasSolicitadas") cuotasSolicitadas: TemplateRef<any>;
  @ViewChild("createdOn") createdOn: TemplateRef<any>;
  @ViewChild("status") status: TemplateRef<any>;
  @ViewChild("aprobar") aprobar: TemplateRef<any>;
  orders: AdvanceFeeResponse[] = [];
  filteredOrders: AdvanceFeeResponse[] = [];
  eAdvanceFeeStatus = EAdvanceFeeStatus;
  groupedOrders = {};

  cuits: string[] = [];
  filteredCuits: string[] = [];
  selectedCuit: string = "";

  maxDate: Date = new Date();
  dateDesde: Date;
  dateHasta: Date;

  fechasVencimientoGroup: FormGroup = new FormGroup({});

  isLoading: boolean = true;
  filteredByDate: boolean = false;

  advanceFeeColumns: Columns[] = [
    { key: "solicitante", title: "Usuario Solicitante", width: "auto" },
    { key: "clientCuit", title: "Cuit Titular", width: "auto" },
    { key: "razonSocial", title: "Nombre Titular", width: "auto" },
    { key: "codProducto", title: "Producto", width: "auto" },
    { key: "cuotasSolicitadas", title: "Cuotas Solicitadas", width: "auto" },
    { key: "status", title: "Estado", width: "auto" },
    { key: "createdOn", title: "Fecha Solicitud", width: "auto" },
    { key: "aprobar", title: "Actualizar", width: "auto" },
  ];

  ordersConfig: Config = {
    additionalActions: false,
    checkboxes: false,
    clickEvent: false,
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
    paginationEnabled: true,
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

  constructor(
    private paymentService: PaymentService,
    public dialog: MatDialog,
    private readonly cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit() {
    _.forEach(this.advanceFeeColumns, (col) => {
      if (col.key === "cuotasSolicitadas")
        col["cellTemplate"] = this.cuotasSolicitadas;
      if (col.key === "createdOn")
        col["cellTemplate"] = this.createdOn;
      if (col.key === "status")
        col["cellTemplate"] = this.status;
      if (col.key === "aprobar")
        col["cellTemplate"] = this.aprobar;
    });
  }

  ngOnInit(): void {
    this.getAdvanceFeeOrders();
  }

  //
  // PETICIONES A API
  //

  getAdvanceFeeOrders() {
    this.paymentService.getAdvanceFeeOrders()
      .pipe(
        finalize(() => {
          this.ordersConfig.isLoading = false;
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe(result => {
        let groupedList = [];
        for (const [fecha, listaCuotas] of Object.entries(_.groupBy(result, "createdOn"))) {
          groupedList.push({ ...listaCuotas[0], cuotasSolicitadas: listaCuotas, updatedStatus: null })
        }

        this.filteredOrders = this.orders = groupedList;

        this.cuits = _.map(_.uniqBy(this.orders, x => x.clientCuit), y => y.clientCuit + ' | ' + y.razonSocial);
        this.filteredCuits = this.cuits;
        this.filteredByDate = false;
        this.dateDesde = this.dateHasta = null;
      },
        error => {
          toaster.error(
            `Póngase en contacto con su administrador para obtener más información: ${error.message}`,
            'Error '
          );
        });
  }

  putAdvanceFeeStatus() {

    this.isLoading = true;
    this.ordersConfig.isLoading = true;
    this.cdr.detectChanges();

    let approvedOrdersIds: any[] = [];
    let canceledOrdersIds: any[] = [];

    for (const [cliente, productos] of Object.entries(this.groupedOrders)) {


      for (const [id, producto] of Object.entries(productos)) {

        switch (producto.updatedStatus) {
          case EAdvanceFeeStatus.Aprobado:
            approvedOrdersIds.push({ orderId: producto.id })
            break;
          case EAdvanceFeeStatus.Rechazado:
            canceledOrdersIds.push({ orderId: producto.id, motivoRechazo: producto.motivoRechazo })
            break;
        }
      }
    }

    this.paymentService.changeAdvanceFeeOrdersStatus(approvedOrdersIds, EAdvanceFeeStatus.Aprobado)
      .subscribe(
        res => this.paymentService.changeAdvanceFeeOrdersStatus(canceledOrdersIds, EAdvanceFeeStatus.Rechazado)
          .subscribe(
            res => this.successReportDialog("Se actualizado exitosamente el estado de las solicitudes."),
            err => this.errorChangeStatusFailed()
          ),
        err => this.errorChangeStatusFailed()
      )
  }

  //
  // MANIPULACIÓN DE DATOS
  //

  filterByDate() {
    this.filteredByDate = true;
    this.filterOrdersByDate(this.orders);
    if (this.selectedCuit !== "") this.selectOrdersByCuit(this.selectedCuit)
  }

  filterOrdersByDate(list: AdvanceFeeResponse[]) {
    this.filteredOrders = list.filter(x => {
      const expirationDate = moment(new Date(x.createdOn).toLocaleDateString(), "DD/MM/YYYY");
      return expirationDate.isBetween(this.dateDesde, this.dateHasta, undefined, '[]');
    });
  }

  removeDateFilter() {
    this.filteredByDate = false;
    this.dateDesde = this.dateHasta = null;
    if (this.selectedCuit) this.selectOrdersByCuit(this.selectedCuit);
    else this.selectOrdersByCuit("Todos");
  }

  //
  // FILTROS
  //

  selectOrdersByCuit(inputCuit: string, fromFilter: boolean = false) {
    if (inputCuit === "Todos") {
      this.selectedCuit = "Todos"
      this.filteredOrders = _.cloneDeep(this.orders);
    } else {
      this.filteredOrders = _.filter(this.orders, x => inputCuit.includes(x.clientCuit));
      this.selectedCuit = this.filteredOrders[0].clientCuit;
    }

    if (this.dateDesde) this.filterOrdersByDate(this.filteredOrders);
  }

  adjustDate() {
    if (!this.dateDesde && this.dateHasta) {
      this.dateDesde = this.dateHasta;
    } else if (this.dateHasta) {
      let desde = moment(this.dateDesde, "DD/MM/YYYY")
      let hasta = moment(this.dateHasta, "DD/MM/YYYY")
      if (hasta.isBefore(desde)) this.dateHasta = this.dateDesde;
    } else {
      this.dateHasta = this.dateDesde;
    }

    this.filterByDate();
  }

  //
  // DIALOG
  //

  errorChangeStatusFailed() {
    this.isLoading = false;
    this.ordersConfig.isLoading = false;
    this.cdr.detectChanges();
    this.errorDialog("Error al intentar actualizar el estado de las solicitudes.<br /><br />Por favor reintente más tarde.")
  }

  successReportDialog(text: string) {
    this.informOpenDialog("check_circle", text);
    this.getAdvanceFeeOrders();
  }

  errorDialog(text: string) {
    this.informOpenDialog("error", text);
  }

  informOpenDialog(type: string, text: string): void {
    this.dialog.open(DialogInfoComponent, {
      maxWidth: '450px',
      panelClass: 'dialog-responsive',
      data: {
        icon: type,
        text: text
      }
    });
  }

  openConfirmOrdersDialog() {
    let groupedOrders = _.groupBy(this.filteredOrders.filter(x => x.updatedStatus !== null), y => y.clientCuit + " | " + y.razonSocial);

    let itemsToShow = {};
    for (const [cliente, solicitudes] of Object.entries(groupedOrders)) {
      let list = [];
      solicitudes.forEach(solicitud => {
        // @ts-ignore
        solicitud.cuotasSolicitadas.forEach(x => {
          // @ts-ignore

          list.push({ ...x, status: solicitud.status, updatedStatus: solicitud.updatedStatus });
        })
      })
      itemsToShow[cliente] = list;

    }
    this.groupedOrders = itemsToShow;
    const dialogRef = this.dialog.open(ConfirmOrdersStatusComponent, {
      minWidth: '800px',
      data: { itemsToShow: itemsToShow }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res === "send") this.putAdvanceFeeStatus();
    });
  }

  //
  // UTILIDADES
  //

  parseStatus(status: EAdvanceFeeStatus) {
    return EAdvanceFeeStatus[status];
  }

  getCurrencyType(code: any) {
    return ECurrency[code];
  }

  validateOrders() {
    return !this.filteredOrders.some(x => x.updatedStatus !== null) || this.fechasVencimientoGroup.invalid
  }

  //
  // CHECKBOX
  //

  changeStatus(row, newStatus) {
    row.updatedStatus = row.status !== newStatus && row.updatedStatus !== newStatus ? newStatus : null;
  }
}
