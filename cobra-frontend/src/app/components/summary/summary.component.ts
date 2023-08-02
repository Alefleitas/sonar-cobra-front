import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
// Servicios
import { SummaryService } from 'src/app/services/summary.service';
import { PropertyService } from 'src/app/services/property.service';
import { PrincipalService } from 'src/app/core/auth';
import { PaymentService } from 'src/app/services/payment.service';
import { UtilityService } from 'src/app/core/services';
import { AuthGuard } from 'src/app/core/guards';
// Ngx Easy Table
import { ConfigEasyTableService } from './summary.configuration-easy-table.service';
import { API, APIDefinition } from 'ngx-easy-table';
import { Columns, Config } from 'ngx-easy-table';
// Modelos
import { Summary } from 'src/app/models/summary';
import { User, PaymentHistory, Property, EPermission, PaymentDetail, UnappliedPayment } from 'src/app/models';
// Componentes
import { toaster } from 'src/app/app.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import { DialogDetailsComponent } from './dialog-details/dialog-details.component';
// Otros
import * as _ from 'lodash';
import * as moment from 'moment';
import { amountConvertTool,amountWithDecimalsConvertTool } from 'src/app/util/amountConvert.pipe';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { AppConfigService } from 'src/app/core/config/AppConfigService';

export interface Options {
  value: number;
  viewValue: string;
}
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnDestroy {

  // Tablas - API
  @ViewChild('historyTable') historyTable: APIDefinition;
  @ViewChild('summaryTable') summaryTable: APIDefinition;

  // Tabla - Saldo pendiente
  @ViewChild('estado') estado: TemplateRef<any>;
  @ViewChild("pagar") pagar: TemplateRef<any>;
  @ViewChild('saldo') saldo: TemplateRef<any>;
  @ViewChild('intereses') intereses: TemplateRef<any>;
  @ViewChild('capital') capital: TemplateRef<any>;
  @ViewChild('invoiceBalance', { static: true }) invoiceBalance: TemplateRef<any>;
  @ViewChild('balanceTrxNumber', { static: true }) balanceTrxNumber: TemplateRef<any>;
  summaryTotal: number;
  summaryTotalCuotas: number;
  summaryTotalVenc: number;

  // Tabla - Historial de pagos
  @ViewChild('importeHistory') importeHistory: TemplateRef<any>;
  @ViewChild('saldoHistory') saldoHistory: TemplateRef<any>;
  @ViewChild('action') action: TemplateRef<any>;

  // Tablas - Columnas 
  columns: Columns[]; // CHEQUEAR SI SE ESTÁ USANDO, SINO ELIMINAR
  columnsBalance: Columns[];
  columnsNested: Columns[];
  unappliedPaymentsColumns: Columns[];

  // Tablas - Configuración
  configurationPayment: Config;
  nestedConfiguration: Config;
  configurationBalance: Config;
  
  // Tablas - Datos a cargar
  paymentsHistory: PaymentHistory[] = [];
  unappliedPayments: UnappliedPayment[] = [];
  summarys: Summary[] = [];

  // Variables de estado de componente
  isLoading: boolean = true;
  isOnMaintenance = false;
  currentUser: User;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  // Relacionados a botones de selección
  cuits: string[] = [];
  filteredCuits: string[] = [];
  selectedCuit: string;
  properties: Property[] = [];
  propertiesOrg: Property[] = [];
  filteredProperties: Property[] = [];
  selectedProperty: string;
  selectedTab: number = 0; // Selector de pestaña/tab de tabla
  selectedEmp: string;

  // FILAS
  public toggledRows = new Set<number>();
  
  // Para crear el botón para seleccionar tabla
  summaryTables = [
    {text: "Saldo pendiente", value: 0},
    {text: "Historial de pagos", value: 1},
    {text: "Detalle de Recibos", value: 2},
  ]

  // Mobile
  onMobile: boolean = false;

  // Selección de cuotas a pagar
  selectedPaymentsIndexes: number[] = [];
  showPayBtn: boolean = false;

  constructor(
    private summaryService: SummaryService,
    private paymentService: PaymentService,
    private propertyService: PropertyService,
    private principalService: PrincipalService,
    private utilityService: UtilityService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private authGuard: AuthGuard,
    private appConfigService: AppConfigService,
    public router: Router
  ) {

  }

  ngOnInit() {
    this.principalService.getIdentity().subscribe((user: User) => {
      this.currentUser = _.cloneDeep(user);
    });

    // Saldo pendiente
    this.columnsBalance = ConfigEasyTableService.columnsBalance;
    this.configurationBalance = ConfigEasyTableService.configurationBalance;

    // Detalle de recibos
    this.unappliedPaymentsColumns = ConfigEasyTableService.unappliedPaymentsColumns;
    
    // Nested - Historial de pagos
    this.columnsNested = ConfigEasyTableService.columnsNested;
    this.nestedConfiguration = ConfigEasyTableService.configNested;
    this.nestedConfiguration.showDetailsArrow = false;
    this.nestedConfiguration.fixedColumnWidth = false;
    this.nestedConfiguration.detailsTemplate = true;
    this.nestedConfiguration.tableLayout.hover = true;
    
    if (!this.isOnMaintenance) {
      this.getCuentaCorrientes();
    }

    this.appConfigService.showAnnouncements("resumenDeCuenta");
  }

  ngAfterViewInit(){
    _.forEach(this.columnsBalance, col => {
      if (col.key === 'estado')
        col['cellTemplate'] = this.estado;
      if (col.key === 'pagar')
        col['cellTemplate'] = this.pagar;
      if (col.key === 'saldo')
        col['cellTemplate'] = this.saldo;
      if (col.key === 'intereses')
        col['cellTemplate'] = this.intereses;
      if (col.key === 'capital')
        col['cellTemplate'] = this.capital;
        if (col.key === 'trxNumber')
          col['cellTemplate'] = this.balanceTrxNumber;
      if (col.key === 'invoice')
        col['cellTemplate'] = this.invoiceBalance;
    });
    _.forEach(this.columnsNested, col => {
      if (col.key === 'importe')
        col['cellTemplate'] = this.importeHistory;
      if (col.key === 'saldo')
        col['cellTemplate'] = this.saldoHistory;
      if (col.key === 'action')
        col['cellTemplate'] = this.action;
    });
  }

  ngAfterViewChecked(){
    const data_labels = document.querySelectorAll("tbody tr td");
    Array.from(data_labels).forEach(x => {
      x.classList.remove("ng-star-inserted")
      x.classList.remove("no-results")
    })
  }

  ngOnDestroy(): void {
    // This aborts all HTTP requests.
    this.ngUnsubscribe.next();
    // This completes the subject properlly.
    this.ngUnsubscribe.complete();
  }

  openDialogWithOutDebts(): void {
    const text = "Su cuenta se encuentra al día y no tiene pagos pendientes.";
    const dialogRef = this.dialog.open(DialogInfoComponent, {
      maxWidth: '600px',
      panelClass: "dialog-responsive",
      data: {text: text, icon: "error"}
    });
  }

  checkSummariesWithOutDebts(): void {

    let countVencidas = _.filter(this.summarys, summ => this._vencidaCheck(summ.fecha));
    let countPorVencer = _.filter(this.summarys, summ => this._porVencerMesActualCheck(summ.fecha));
    if(countVencidas.length == 0 && countPorVencer.length == 0){
      this.openDialogWithOutDebts();
    }
  }

  openDialogDetails(details: PaymentDetail[]){
    this.dialog.open(DialogDetailsComponent, {
      maxWidth: '600px',
      panelClass: 'dialog-responsive',
      data: {details: details}
    });
  }


  cleanTables() {
    this.summaryTotal = 0;
    this.summaryTotalCuotas = 0;
    this.summaryTotalVenc = 0;
    this.summarys = new Array<Summary>();
    this.paymentsHistory = new Array<PaymentHistory>();
    this.unappliedPayments = new Array<UnappliedPayment>();
  }

  getPaymentsSummary(mixedEmpAndCode: string) {
    this.isLoading = true;
    this.selectedPaymentsIndexes = [];
    this.paymentService.selectedPayments = {
      cuit: "",
      emprendimiento: "",
      cuitEmpresa: "",
      producto: "",
      moneda: "",
      fechas: []
    };

    this.showPayBtn = false;

    this.cleanTables();
    this.eventEmitter({event: 'customEvent'});
    this.toggledRows.clear();
    let property = _.find(this.properties, p => p.mixedEmpAndCode === mixedEmpAndCode);
    this.paymentService.selectedPayments.cuit = property.nroCuitCliente;
    this.paymentService.selectedPayments.emprendimiento = property.emprendimiento;
    this.paymentService.selectedPayments.producto = property.productCode;

    this._resetPagination();
    this.summaryService.GetPaymentsSummary(property.nroCuitCliente, property.productCode)
    .pipe(
      finalize(() => this.updateSummarySelectedRows())
    )
    .subscribe(
      (res: any) => {
        if (res) {
          this.summarys = res.filter(summ => summ.saldo > 0);

          for (let i = 0; i < this.summarys.length; i++) {
            this.summarys[i].check = this.summarys[i].onDebtDetail && !this.summarys[i].processing;
            if (this.summarys[i].check) this.selectedPaymentsIndexes.push(i);
          }
          if (_.some(this.summarys, { 'check': true })) this.showPayBtn = true;

          this.summaryTotal = _.sumBy(this.summarys, s => parseFloat(s.saldo.toString()));
          this.summaryTotalCuotas = this.summarys.length;
          this.summaryTotalVenc = _.sumBy(_.filter(this.summarys, summ => this._vencidaCheck(summ.fecha)), s => parseFloat(s.saldo.toString()));

          this.checkSummariesWithOutDebts();
        }
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
        toaster.error(
          `Póngase en contacto con su administrador para obtener más información: ${error.message}`,
          'Error '
        );
      }
    );

    this.isLoading = true;
    this.paymentService.getPaymentHistory(property.nroCuitCliente, property.productCode)
    .subscribe((res: PaymentHistory[]) => {
      if (res) {
        this.paymentsHistory = _.map(res, ph => {
          _.forEach(ph.details, d => {
            d.importe = amountConvertTool(d.importe, null, true);
            if (d.applTc) {
              d.applTc = amountConvertTool(d.applTc, null, true);
            } else if (d.moneda == 'ARS' && d.monedaFC == 'ARS') {
              d.applTc = amountConvertTool(1, null, true);
            }
            d.importeFC = amountConvertTool(d.importeFC, null, true);
          });
          return ph;
        });
      }
      this.isLoading = false; 
    },
    error => {
      this.isLoading = false;
      toaster.error(
        `Póngase en contacto con su administrador para obtener más información: ${error.message}`,
        'Error '
      );
    });

    this.isLoading = true;
    this.paymentService.getUnappliedPayments(property.nroCuitCliente, property.productCode)
    .subscribe((res: UnappliedPayment[]) => {
      if (res) {
        this.unappliedPayments = _.map(res, up => {
          let usdImporte = up.importe;
          up.importe =  amountConvertTool(up.importe, up.moneda, true);
          if (up.moneda == 'USD') {
            up.importeTc = amountConvertTool(1, up.moneda,  true);
            up.conversion = amountConvertTool(usdImporte, 'USD', true);
          } else if (up.importeTc) {
            up.importeTc =  amountConvertTool(up.importeTc, up.moneda, true);
            up.conversion = amountWithDecimalsConvertTool(up.conversion, 'USD', true);
          }
          return up;
        });
      }
      this.isLoading = false;
    },
    error => {
      this.isLoading = false;
      toaster.error(
        `Póngase en contacto con su administrador para obtener más información: ${error.message}`,
        'Error '
      );
    });
  }

  onRowClickEvent($event: MouseEvent, index: number): void {
    $event.preventDefault();
    if (this.toggledRows.has(index)) {
      this.toggledRows.delete(index);
      this.historyTable.apiEvent({
        type: API.toggleRowIndex,
        value: index,
      });
    } else {
      //first close all
      if(this.toggledRows.size > 0) {
        this.toggledRows.forEach(item => {
          this.historyTable.apiEvent({
            type: API.toggleRowIndex,
            value: item,
          });
          this.toggledRows.delete(item);
        })
      }
      //then add and toggle
      this.toggledRows.add(index);
      this.historyTable.apiEvent({
        type: API.toggleRowIndex,
        value: index,
      });
    } 
  }

  eventEmitter(event) {
    if(event.event === 'onPagination' || event.event === 'customEvent') {
      if (this.toggledRows.size > 0) {
        this.toggledRows.forEach(item => {
          this.historyTable.apiEvent({
            type: API.toggleRowIndex,
            value: item,
          });
          this.toggledRows.delete(item);
        })
      }
    }
  }

  hideTooltip() {
    this.utilityService.navigateToHome(this.currentUser);
  }

  filterCuentasByCuit = (cuit: string) => {
    this.cleanTables();

    if (cuit === 'Todos') {
      this.properties = _.sortBy(_.cloneDeep(this.propertiesOrg), prop => prop.mixedEmpAndCode);
    } else {

      let filterCuit = undefined;
      if(cuit.indexOf(' | ') > -1){
        filterCuit = cuit.split(' | ')[0];
      } else {
        filterCuit = cuit;
      }

      this.properties = _.sortBy(_.cloneDeep(_.filter(this.propertiesOrg, c => c.nroCuitCliente === filterCuit)), prop => prop.mixedEmpAndCode);
    }
    this.filteredProperties = _.cloneDeep(this.properties);

    this.selectedEmp = '';
    this.selectedProperty = '';
    this.showPayBtn = false;
  }

  getCuentaCorrientes() {
    this.propertyService.getPropertySummaryCodes().pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (res: any) => {
        this.propertiesOrg = res;
        _.forEach(res, prop => {
          prop['mixedEmpAndCode'] = `${prop.emprendimiento} | ${prop.productCode}`;
        });
        this.properties = _.sortBy(_.cloneDeep(this.propertiesOrg), prop => prop.mixedEmpAndCode);
        this.cuits = _.map(_.uniqBy(this.properties, p => p.nroCuitCliente), pr => pr.nroCuitCliente + ' | ' + pr.razonSocial);
        this.filteredCuits = _.cloneDeep(this.cuits);
        this.filterCuentasByCuit('Todos');
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
        toaster.error(
          `Póngase en contacto con su administrador para obtener más información: ${error.message}`,
          'Error '
        );
      }
    );
  }

  canAccessEverybodyPayments(): boolean {
    return this.authGuard.isAllowed([EPermission.Access_EverybodysPayments], this.currentUser) ||
      this.authGuard.isAllowed([EPermission.Access_EverybodysPaymentsCriba], this.currentUser);
  }

  _onTabChanged(e) {
    this.selectedTab = e.index;
    if (this.selectedTab === 0) this.updateSummarySelectedRows();
  }

  _vencidaCheck(fec) {
    return moment().diff(moment(fec, 'DD/MM/YYYY'), 'days') > 0 ? true : false;
  }

  _porVencerMesActualCheck(fec) {
    return !this._vencidaCheck(fec) && moment().diff(moment(fec, 'DD/MM/YYYY'), 'months') == 0 ? true : false;
  }

  _resetPagination() {
    this.summaryTable.apiEvent({
      type: API.setPaginationCurrentPage,
      value: 1,
    });
    this.historyTable.apiEvent({
      type: API.setPaginationCurrentPage,
      value: 1,
    });
  }

  unappliedPaymentsExportToExcel(): void {

    try {

      let unappliedPaymentsToExport = this.unappliedPayments.map(unappliedPayment => {
        let up = new Object();
        up['fecha'] = unappliedPayment.fecha;
        up['importe'] = unappliedPayment.importe;
        up['importeTc'] = unappliedPayment.importeTc;
        up['operacion'] = unappliedPayment.operacion;
        return up;
      });

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(unappliedPaymentsToExport);
      ws.A1.v = this.unappliedPaymentsColumns[0].title;
      ws.B1.v = this.unappliedPaymentsColumns[1].title;
      ws.C1.v = this.unappliedPaymentsColumns[2].title;
      ws.D1.v = this.unappliedPaymentsColumns[3].title;

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      XLSX.writeFile(wb, `Detalle de Recibos ${this.selectedCuit} - ${this.selectedProperty}.xlsx`);
    } catch (err) {
      toaster.error(`Ocurrió un error al exportar en Excel: ${err.message}`, 'Error ');
    }
  }

  downloadInvoice(row:PaymentDetail){
    row["isInvoiceLoading"] = true;
    this.paymentService.getInvoice(row.trxId, row.facElect).subscribe(res=>{
     const linkSource = 'data:application/pdf;base64,' + res;
        const downloadLink = document.createElement("a");
        const fileName =  row.trxNumber + ".pdf";

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
        row["isInvoiceLoading"] = false;
    }, error=> {
      row["isInvoiceLoading"] = false;
      toaster.error(
        `Póngase en contacto con su administrador para obtener más información: ${error.message}`,
        'Error '
      );
    });
  }

  changePagarValue(index: any, event: any) {
    event.preventDefault();

    if (this.summarys[index].check === false) {
      for (let i = index; i >= 0; i--) {
        if (this.summarys[i].check === false && this.summarys[i].onDebtDetail && !this.summarys[i].processing) {
          this.summarys[i].check = true; 
          this.selectedPaymentsIndexes.push(i)
          this.updateSummaryRowClass(i, 'add');     
          this.cdr.detectChanges()     
        }
      }
    }
    else {
      for (let i = index; i < this.summarys.length; i++) {
        if (this.summarys[i].check === true && this.summarys[i].onDebtDetail && !this.summarys[i].processing) {
          this.summarys[i].check = false;
          this.selectedPaymentsIndexes = this.selectedPaymentsIndexes.filter(e => e !== i);
          this.updateSummaryRowClass(i, 'remove');       
          this.cdr.detectChanges()   
        }
      }
    }
  }

  waitForRow(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

  updateSummaryRowClass(index, action){
    const child = index + 1;
    const row = document.querySelector('#summary-table tbody tr:nth-child(' + child + ')');
    if (row){
      if (action === 'add') row.classList.add('selectedRow');
      else row.classList.remove('selectedRow');
    }
  }

  updateSummarySelectedRows(){
    this.selectedPaymentsIndexes.forEach(x => {
      this.cdr.detectChanges();
      this.updateSummaryRowClass(x, 'add');
    });
  }

  paySelectedPayments(moneda: string){
    if(this.selectedPaymentsIndexes.length){
      this.paymentService.selectedPayments = {
        ...this.paymentService.selectedPayments,
        moneda: moneda,
        fechas: []
      };
      for (let i = 0; i < this.summarys.length; i++){
        if (this.selectedPaymentsIndexes.includes(i)){
          this.paymentService.selectedPayments.fechas.push(this.summarys[i].fecha);
        }
      }
      this.router.navigate(['/payments', { fromSummary: 'true' }]);
    }
  }

}
