import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild,  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import * as _ from 'lodash';
import { API, Columns, Config, STYLE, THEME } from 'ngx-easy-table';
import { ECurrency } from 'src/app/models';
import { Debin, InformDebin } from 'src/app/models/debin';
import { PaymentService } from 'src/app/services/payment.service';
import { finalize } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { ConfirmDebinDialogComponent } from './confirm-debin-dialog/confirm-debin-dialog.component';

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
  selector: "app-debin",
  templateUrl: "./debin.component.html",
  styleUrls: ["./debin.component.scss"],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class DebinComponent implements OnInit {
  @ViewChild('debinTable') debinTable: any;
  @ViewChild("nombre") nombre: TemplateRef<any>;
  @ViewChild("cuit") cuit: TemplateRef<any>;
  @ViewChild("moneda", { static: true }) moneda: TemplateRef<any>;
  @ViewChild("monto") monto: TemplateRef<any>;
  @ViewChild("status") status: TemplateRef<any>;
  @ViewChild("fechaTransaccion") fechaTransaccion: TemplateRef<any>;
  @ViewChild("fechaRecibo") fechaRecibo: TemplateRef<any>;
  @ViewChild("seleccion") seleccion: TemplateRef<any>;

  debines: Debin[] = [];
  filteredDebines: Debin[] = [];

  payers: {cuit: string, id: string}[] = [];
  filteredPayers: {cuit: string, id: string}[] = [];
  selectedPayer: string = "";
  
  maxDate: Date = new Date();
  dateDesde: Date;
  dateHasta: Date;

  reportes: InformDebin[] = [];
  
  fechasReciboGroup: FormGroup = new FormGroup({});

  isLoading: boolean = true;
  filteredByTransaction: boolean = false;

  public pagination = {
    limit: 10,
    offset: 0,
    count: -1,
  };

  public orderTable: {key: string, order: 'asc'|'desc'};

  debinColumns: Columns[] = [
    { key: "nombre", title: "Nombre", width: "auto" },
    { key: "cuit", title: "Cuit", width: "auto" },
    { key: "currency", title: "Moneda", width: "auto" },
    { key: "monto", title: "Monto", width: "auto" },
    { key: "status", title: "Estado", width: "auto" },
    { key: "fechaTransaccion", title: "Fecha de transacción", width: "150px" },
    { key: "fechaRecibo", title: "Fecha de recibo", width: "auto" },
    { key: "seleccion", title: "Seleccionar", width: "auto" },
  ];

  debinConfig: Config = {
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
    serverPagination: true,
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
    private readonly cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    _.forEach(this.debinColumns, (col) => {
      if (col.key === "nombre") 
        col["cellTemplate"] = this.nombre;
      if (col.key === "cuit") 
        col["cellTemplate"] = this.cuit;
      if (col.key === "currency") 
        col["cellTemplate"] = this.moneda;
      if (col.key === "monto") 
        col["cellTemplate"] = this.monto;
      if (col.key === "status") 
        col["cellTemplate"] = this.status;
      if (col.key === "fechaTransaccion") 
        col["cellTemplate"] = this.fechaTransaccion;
      if (col.key === "fechaRecibo") 
        col["cellTemplate"] = this.fechaRecibo;
      if (col.key === "seleccion") 
        col["cellTemplate"] = this.seleccion;
    });
  }

  ngOnInit() {
    this.getCuits();
    this.getDebines(this.generateParams());
  }
  
  //
  // PETICIONES A API
  //
  
  getCuits(){
    this.paymentService.getAllUsersFromDebines().subscribe(result => {
      // @ts-ignore
      this.payers = this.filteredPayers = _.map(_.uniqBy(result, x => x.cuit), y => {return {cuit: y.cuit + ' | ' + y.firstName + " " + y.lastName, id: y.id}});
    });
  }
  
  getDebines(params: string) {  
    this.isLoading = this.debinConfig.isLoading = true;
    this.debinConfig.paginationEnabled = false;
    this.cdr.detectChanges();

    this.paymentService.getAllDebines(params)
    .pipe(
      finalize(() => {
        this.isLoading = this.debinConfig.isLoading = false;
    this.debinConfig.paginationEnabled = true;
    this.cdr.detectChanges();
      })
    )
    .subscribe(result => {
      this.debines = result.debinList;
      this.pagination.count =
      this.pagination.count === -1 ? result ? result.totalCount : 0 : result.totalCount;
      this.pagination = { ...this.pagination };

      _.forEach(this.debines, x => {
        x.seleccion = false;
        x.fechaRecibo = null;
      });

      if (this.orderTable) this.debines = this.orderArray(this.debines);

      this.filteredDebines = _.cloneDeep(this.debines)
    });
  }

  sendDebinReport(){
    this.isLoading = this.debinConfig.isLoading = true;
    this.debinConfig.paginationEnabled = false;
    this.cdr.detectChanges();

    let checkedDebines = _.filter(this.debines, x => x.seleccion && !!x.fechaRecibo);
    this.reportes = _.map(checkedDebines, x => {
      let inform = new InformDebin;
      inform.id = x.id;
      inform.fechaRecibo = new Date(x.fechaRecibo);
      return inform
    })

    this.paymentService.informPaymentMethodDoneManual(this.reportes)
      .subscribe(
        res => this.successReportDialog("Los reportes han sido informados exitosamente."),
        err => {
          this.isLoading = this.debinConfig.isLoading = false;
          this.debinConfig.paginationEnabled = true;
          this.cdr.detectChanges();
          this.errorDialog("Error al intentar informar los reportes.<br /><br />Por favor reintente más tarde.")
        }
      )
  }

  //
  // GENERACIÓN PETICIÓN
  //

  eventEmitted($event: { event: string; value: any }): void {
    if ($event.event === "onOrder") {
      this.orderTable = $event.value;
      this.filteredDebines = this.orderArray(this.filteredDebines);
    }
    else if ($event.event !== 'onClick' && $event.event !== 'onDoubleClick' && $event.event !== 'onGlobalSearch') {
      this.parseEvent($event);
    }
  }

  private parseEvent(obj: any): void {
    this.pagination.limit = obj.value.limit ? obj.value.limit : this.pagination.limit;
    this.pagination.offset = obj.value.page ? obj.value.page : this.pagination.offset;
    // this.pagination = { ...this.pagination };
    this.cdr.detectChanges();

    this.getDebines(this.generateParams());
  }

  private generateParams(){
    let params = `limit=${this.pagination.limit}&page=${this.pagination.offset}`;
    this.selectedPayer !== 'Todos' ? params += '&payerId=' + this.selectedPayer : null
    try {
      if (this.dateDesde && this.dateHasta) {
        // @ts-ignore
        params += '&fechaDesde=' + this.dateDesde.format("DD/MM/yyyy") + '&fechaHasta=' + this.dateHasta.format("DD/MM/yyyy")
      }
    } catch {}
    return params
  }

  resetPagination() {
    this.debinTable.apiEvent({
       type: API.setPaginationCurrentPage,
       value: 1
     });
   }

  //
  // MANIPULACIÓN DE DATOS
  //

  removeDateFilter(){
    this.filteredByTransaction = false;
    this.dateDesde = this.dateHasta = null;
    if (this.selectedPayer) this.selectDebinesByCuit(this.selectedPayer);
    else this.selectDebinesByCuit("Todos");
  }

  orderArray(list){
    let key = this.orderTable.key;
    switch (key){
      case "monto":
        key = "amount";
        break;
      case "cuit":
        key = "payer.cuit";
        break;
      case "nombre":
        key = "payer.firstName";
        break;
      case "fechaTransaccion":
        key = "transactionDate"
        break;
    }

    return _.orderBy(list, [key], [this.orderTable.order])
  }

  //
  // FILTROS
  //

  selectDebinesByCuit(inputPayer: string, fromFilter: boolean = false) {
    this.selectedPayer = inputPayer;

    this.resetPagination();
    this.getDebines(this.generateParams());
  }

  adjustDate() {
    if (!this.dateDesde && this.dateHasta){
      this.dateDesde = this.dateHasta;
    } else if (this.dateHasta){
      let desde = moment(this.dateDesde, "DD/MM/YYYY")
      let hasta = moment(this.dateHasta, "DD/MM/YYYY")
      if (hasta.isBefore(desde)) this.dateHasta = this.dateDesde;
    } else {
      this.dateHasta = this.dateDesde;
    }

    this.filteredByTransaction = true;
    this.resetPagination();
    this.getDebines(this.generateParams());
	}

  //
  // CHECKBOX Y FECHA - INPUTS DE TABLA
  //

  updateChecked(event, row) {
    this.updateFechasReciboGroup(row.id, event.source.checked)
    this.debines.find(x => x.id === row.id).seleccion = event.source.checked;
    row.seleccion = event.source.checked;
  }

  setDate(event, id) {
    this.debines.find(x => x.id === id).fechaRecibo = new Date(event.value.year(), event.value.month(), event.value.date());
  }

  updateFechasReciboGroup(id: number, checked: boolean) {
    let controls = {};

    _.forEach(this.debines, x => {
      if (x.id === id) {
        checked && !x.fechaRecibo ? x.fechaRecibo = new Date() : x.fechaRecibo = null;
        if (!!x.fechaRecibo) controls[x.id] = new FormControl(x.fechaRecibo, Validators.required)
      } else {
        if (x.seleccion) controls[x.id] = new FormControl(x.fechaRecibo, Validators.required)
      }
    })

    this.fechasReciboGroup = new FormGroup(controls);
  }
  
  //
  // DIALOG
  //

  successReportDialog(text: string){
    this.informOpenDialog("check_circle", text);
    this.resetPagination();
    this.getDebines(this.generateParams());
  }

  errorDialog(text: string){
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

  openConfirmDebinDialog(){
    let debinsWithDate = this.debines.filter(x => x.seleccion && !!x.fechaRecibo);
    let groupedDebins = _.groupBy(debinsWithDate, y => y.payer.cuit.toString() + " | " + y.payer.firstName);

    const dialogRef = this.dialog.open(ConfirmDebinDialogComponent, {
      maxWidth: '450px',
      panelClass: 'dialog-responsive',
      data: { groupedDebins: groupedDebins }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res === "send") this.sendDebinReport();
    });
  }

  //
  // UTILIDADES
  //

  parseStatus(status: any) {
    switch (status) {
      case 0:
        return "Pendiente";
      case 1:
        return "Aprobado";
      case 2:
        return "Rechazado";
      case 3:
        return "Expirado";
      case 4:
        return "Cancelado";
      case 5:
        return "Error";
      case 6:
        return "En proceso";
      case 7:
        return "Finalizado";
      case 8:
        return "Informado manualmente";
      case 9:
        return "Error al informar";
      case 10:
        return "Informando";
    }
  }

  getCurrencyType(code: any) {
    return ECurrency[code];
  }

  validateDebins(){
    return !this.debines.some(x => x.seleccion) || this.fechasReciboGroup.invalid
  }

}
