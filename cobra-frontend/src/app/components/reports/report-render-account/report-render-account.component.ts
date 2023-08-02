import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";
import * as _ from "lodash";
import * as moment from "moment";
import { PaymentService } from "src/app/services/payment.service";
import { EPaymentInstrument, EPaymentSource, EPaymentStatus, EPaymentType } from "src/app/models/payment";
import { ReporteRendiciones } from "src/app/models/rendition-report";
import { ECurrency } from "src/app/models/currency";
import { ReportTableComponent } from "./report-table/report-table.component";
import * as XLSX from "xlsx";
import { toaster } from 'src/app/app.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";

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
  selector: "app-report-render-account",
  templateUrl: "./report-render-account.component.html",
  styleUrls: ["./report-render-account.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ReportRenderAccountComponent implements OnInit {
  // CRITERIOS PARA TABLAS SEGÚN ESTADO
  // Aprobados => Approved, Finalized
  // Rechazados => Rejected, Cancelled
  // Pendientes => Pending, InProcess
  // No procesados => Error, Expired

  // TODO: Remplazo 'Informed' por 'Finalizado' -> Aprobados

  @ViewChild('aprobadoTable') aprobadoTable: ReportTableComponent;
  @ViewChild('rechazadoTable') rechazadoTable: ReportTableComponent;
  @ViewChild('pendienteTable') pendienteTable: ReportTableComponent;
  @ViewChild('noProcesadoTable') noProcesadoTable: ReportTableComponent;
  @ViewChild('todoTable') todoTable: ReportTableComponent;

  rendicionesCompletas: ReporteRendiciones[] = [];
  rendicionesAprobadas: any;
  rendicionesRechazadas: any;
  rendicionesPendientes: any;
  rendicionesNoProcesadas: any;
  fullRendiciones: any;

  searchValue: string = "";
  maxDate: Date = new Date();
  dateDesde: Date;
  dateHasta: Date;

  selectedTab: number = 0;
  isLoading: boolean = false;

  constructor(
    public paymentService: PaymentService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadingState(true);
    this.paymentService.GetAllRenditionReport()
      .subscribe(response => {
        this.rendicionesCompletas = _.cloneDeep(response);
        this.separateData(response);
        this.cdr.detectChanges();
      })
  }

  loadingState(value: boolean){
    this.isLoading = value;
  }
  
  showAllRenditions(){
    this.loadingState(true);
    this.dateDesde = this.dateHasta = null;
    
    this.separateData(this.rendicionesCompletas);

    this.searchValue = "";
    this.filter(this.searchValue);
  }

  filterByTransactionDate() {
    this.loadingState(true);

    const list = this.rendicionesCompletas.filter(x => {
      const transactionDate = moment(new Date(x.transactionDate).toLocaleDateString(), "DD/MM/YYYY");
      return transactionDate.isBetween(this.dateDesde, this.dateHasta, undefined, '[]');
    });

    this.separateData(list);
  }

  separateData(list){

    const aprobadoCriterio = [EPaymentStatus.Approved, EPaymentStatus.Finalized, EPaymentStatus.InformedManually, EPaymentStatus.Informing, EPaymentStatus.ErrorInform];
    const rechazadoCriterio = [EPaymentStatus.Rejected, EPaymentStatus.Cancelled]
    const pendienteCriterio = [EPaymentStatus.Pending, EPaymentStatus.InProcess]
    const noProcesadoCriterio = [EPaymentStatus.Error, EPaymentStatus.Expired]

    const filterAprobadas = list.filter(x => aprobadoCriterio.includes(x.status) );
    this.rendicionesAprobadas = this.cleanData(filterAprobadas);

    const filterRechazadas = list.filter(x => rechazadoCriterio.includes(x.status) );
    this.rendicionesRechazadas = this.cleanData(filterRechazadas);

    const filterPendientes = list.filter(x => pendienteCriterio.includes(x.status) );
    this.rendicionesPendientes = this.cleanData(filterPendientes);

    const filterNoProcesadas = list.filter(x => noProcesadoCriterio.includes(x.status) );
    this.rendicionesNoProcesadas = this.cleanData(filterNoProcesadas);

    this.fullRendiciones = this.cleanData(list);

    this.loadingState(false)
  }

  cleanData(arr){
    return arr.map(x => {
      return {
        id: x.id,
        medioDePago: EPaymentInstrument[x.instrument],
        status: this.parseStatus(x.status),
        cuitCliente: x.payer.cuit,
        currency: ECurrency[x.currency],
        amount: x.amount,
        source: EPaymentSource[x.source],
        type: this.parseType(x.type),
        fechaTransaccion: moment(x.transactionDate).format("DD/MM/YYYY"),
        hasPaymentDetail: x.hasPaymentDetail
      }
    })
  }

  _onTabChanged(e) {
    this.selectedTab = e.index;
  }

  checkTableData(){
    switch(this.selectedTab){
      case 0:
        return this.rendicionesAprobadas.length > 0
      case 1:
        return this.rendicionesRechazadas.length > 0
      case 2:
        return this.rendicionesPendientes.length > 0
      case 3:
        return this.rendicionesNoProcesadas.length > 0
      case 4:
        return this.fullRendiciones.length > 0
    }
  }

  filter(value: string) {
    this.aprobadoTable.filter(value);
    this.rechazadoTable.filter(value);
    this.pendienteTable.filter(value);
    this.noProcesadoTable.filter(value);
    this.todoTable.filter(value);
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

    this.filterByTransactionDate();
	}

  parseStatus(code){
    let status = "";
    switch(code){
      case 0:
        status = "Pendiente";
        break;
      case 1:
        status = "Aprobado";
        break;
      case 2:
        status = "Rechazado";
        break;
      case 3:
        status = "Expirado";
        break;
      case 4:
        status = "Cancelado";
        break;
      case 5:
        status = "Error";
        break;
      case 6:
        status = "En proceso";
        break;
      case 7:
        status = "Finalizado";
        break;
      case 8:
        status = "Informado manualmente";
        break;
      case 9:
        status = "Error al informar";
        break;
      case 10:
        status = "Informando";
        break;
    }
    return status;
  }

  parseType(str){
    let type = "";
    switch(str){
      case 0:
        type = "Normal";
        break;
      case 1:
        type = "Recursivo";
        break;
      case 3:
        type = "Al Día";
        break;
      case 4:
        type = "QCP";
        break;
    }
    return type;
  }

  cantidadAcreditada(moneda: string){
    return this.rendicionesAprobadas.filter(x => x.currency === moneda).length
  }

  totalAcreditado(moneda: string){
    return this.rendicionesAprobadas.filter(x => x.currency === moneda).reduce(function (accumulator, currentObject) {
      return accumulator + currentObject.amount
    }, 0);
  }

  getExportTooltip(){
    let table = "";
    switch(this.selectedTab){
      case 0:
        table = "APROBADAS"
        break
      case 1:
        table = "RECHAZADAS"
        break
      case 2:
        table = "PENDIENTES"
        break
      case 3:
        table = "NO PROCESADAS"
        break
      case 4:
        table = "TODAS"
        break
    }

    return `Exportar tabla "${table}" (según filtrado de fechas)`
  }

  mapRendicionesForExcel(arr){
    return arr.map(x => {
      return {
        medioDePago: x.medioDePago,
        status: x.status,
        cuit: x.cuitCliente.toString(),
        currency: x.currency,
        amount: x.amount,
        source: x.source,
        type: x.type,
        fechaTransaccion: x.fechaTransaccion
      }
    })
  }

  exportToExcel(): void {
    try {
      let dataToExport = [];
      let tabla = "";
      let fechas = "" 
      if (this.dateDesde && this.dateHasta){
        let desde = moment(this.dateDesde).format("DD/MM/YYYY");
        let hasta = moment(this.dateHasta).format("DD/MM/YYYY");
        if (this.dateDesde === this.dateHasta){
          fechas = ` al ${desde}`
        } else {
          fechas = ` entre ${desde} y ${hasta}`
        }
      }

      switch(this.selectedTab){  
        case 0:
          dataToExport = this.mapRendicionesForExcel(this.rendicionesAprobadas);
          tabla = "Acreditadas";
          break;
        case 1:
          dataToExport = this.mapRendicionesForExcel(this.rendicionesRechazadas);
          tabla = "Rechazadas";
          break;
        case 2:
          dataToExport = this.mapRendicionesForExcel(this.rendicionesPendientes);
          tabla = "Pendientes";
          break;
        case 3:
          dataToExport = this.mapRendicionesForExcel(this.rendicionesNoProcesadas);
          tabla = "No Procesadas";
          break;
        case 4:
          dataToExport = this.mapRendicionesForExcel(this.fullRendiciones);
          tabla = "Completas";
          break;
      
      }

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);

      ws.A1.v = "Medio de Pago";
      ws.B1.v = "Status";
      ws.C1.v = "CUIT";
      ws.D1.v = "Moneda";
      ws.E1.v = "Importe";
      ws.F1.v = "Fuente";
      ws.G1.v = "Tipo";
      ws.H1.v = "Fecha Transacción";

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      /* save to file */
      XLSX.writeFile(
        wb,
        `Reporte de Rendiciones ${tabla}${fechas}.xlsx`
      );
      
    } catch (err) {
      toaster.error(
        `Ocurrió un error al exportar en Excel: ${err.message}`,
        "Error "
      );
    }
  }
}
