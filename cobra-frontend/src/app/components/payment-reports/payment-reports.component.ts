import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DialogInfoComponent } from "../dialog-info/dialog-info.component";
import * as _ from "lodash";
import {
  API,
  APIDefinition,
  Columns,
  Config,
  STYLE,
  THEME,
} from "ngx-easy-table";
import {
  EcheqReport,
  ECurrency,
  EMedioDePago,
  EPaymentReportStatus,
  PaymentReport,
} from "src/app/models";
import { PaymentService } from "src/app/services/payment.service";
import { finalize } from "rxjs/operators";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import * as moment from "moment";
import { DatePipe, formatDate } from "@angular/common";

export const MY_FORMATS = {
  parse: {
    dateInput: "DD/MM/YYYY",
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "MMMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};

@Component({
  selector: "app-payment-reports",
  templateUrl: "./payment-reports.component.html",
  styleUrls: ["./payment-reports.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PaymentReportsComponent implements OnInit {
  @ViewChild("paymentReportsTable") paymentReportsTable: APIDefinition;
  @ViewChild("product") product: TemplateRef<any>;
  @ViewChild("cuit") cuit: TemplateRef<any>;
  @ViewChild("razonSocial") razonSocial: TemplateRef<any>;
  @ViewChild("reportDate") reportDate: TemplateRef<any>;
  @ViewChild("currency", { static: true }) currency: TemplateRef<any>;
  @ViewChild("amount") amount: TemplateRef<any>;
  @ViewChild("status") status: TemplateRef<any>;
  @ViewChild("type") type: TemplateRef<any>;
  @ViewChild("reportDateVto") reportDateVto: TemplateRef<any>;

  paymentReports: PaymentReport[] = [];
  filteredPaymentReports: PaymentReport[] = [];
  echeqReports: EcheqReport[] = [];
  filteredEcheqReports: EcheqReport[] = [];

  // selectedType: EMedioDePago|string = EMedioDePago.ECHEQ;

  maxDate: Date = new Date();
  dateDesde: Date;
  dateHasta: Date;
  selectedDatesChanged: boolean = false;

  isLoading: boolean = true;
  filteredByDate: boolean = false;
  //filteredByType: boolean = false;

  today: Date = moment().toDate();

  public pagination = {
    limit: 10,
    offset: 0,
    count: -1,
  };

  public orderTable: { key: string; order: "asc" | "desc" };

  paymentReportColumns: Columns[] = [
    { key: "product", title: "Producto", width: "auto" },
    { key: "cuit", title: "Cuit", width: "auto" },
    { key: "razonSocial", title: "Razón Social", width: "auto" },
    { key: "reportDate", title: "Fecha de reporte", width: "150px" },
    { key: "currency", title: "Moneda", width: "auto" },
    { key: "amount", title: "Monto", width: "auto" },
    { key: "status", title: "Estado", width: "auto" },
    { key: "type", title: "Instrumento", width: "auto" },
    { key: "reportDateVto", title: "Fecha de vencimiento", width: "150px" },
  ];

  paymentReportConfig: Config = {
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
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    _.forEach(this.paymentReportColumns, (col) => {
      if (col.key === "product") col["cellTemplate"] = this.product;
      if (col.key === "cuit") col["cellTemplate"] = this.cuit;
      if (col.key === "razonSocial") col["cellTemplate"] = this.razonSocial;
      if (col.key === "reportDate") col["cellTemplate"] = this.reportDate;
      if (col.key === "currency") col["cellTemplate"] = this.currency;
      if (col.key === "amount") col["cellTemplate"] = this.amount;
      if (col.key === "status") col["cellTemplate"] = this.status;
      if (col.key === "type") col["cellTemplate"] = this.type;
      if (col.key === "reportDateVto") col["cellTemplate"] = this.reportDateVto;
    });
  }

  ngOnInit(): void {
    this.today.setHours(0, 0, 0, 0);
    let tomorrow = new Date(this.today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.getPaymentReportsByDate(this.today, tomorrow);
  }

  //
  // PETICIONES A LA API
  //

  getPaymentReportsByDate(fromDate: Date, toDate: Date) {
    // Comprueba si ya tiene los reportes del rango de fechas seleccionado
    if (this.paymentReports.length > 0) {
      let clientReports = _.orderBy(this.paymentReports, (x) => x.reportDate);

      let firstReportDate = _.first(clientReports).reportDate;
      let lastReportDate = _.last(clientReports).reportDate;

      let firstReportDateMoment = moment(firstReportDate);
      let lastReportDateMoment = moment(lastReportDate);

      let fromDateMoment = moment(fromDate);
      let toDateMoment = moment(toDate);

      if (fromDateMoment.isSameOrAfter(firstReportDateMoment) &&
      toDateMoment.isSameOrBefore(lastReportDateMoment))
        {

        this.filteredPaymentReports = [];

        _.filter(this.paymentReports, (x) => {
          let date = moment(moment(x.reportDate).format());
          if (date.isSameOrAfter(fromDateMoment) &&
            date.isSameOrBefore(toDateMoment)) {
            this.filteredPaymentReports.push(x);
          }
        });

        this.echeqReports = this.mapEcheqReports(this.filteredPaymentReports);
        this.filteredEcheqReports = _.cloneDeep(this.echeqReports);
      }
    } else {
      // Si no los tiene hace la request
      this.isLoading = this.paymentReportConfig.isLoading = true;
      this.paymentReportConfig.paginationEnabled = false;
      this.cdr.detectChanges();

      this.paymentService
        .getPaymentReportsByDate(fromDate, toDate)
        .pipe(
          finalize(() => {
            this.isLoading = this.paymentReportConfig.isLoading = false;
            this.paymentReportConfig.paginationEnabled = true;
            this.cdr.detectChanges();
          })
        )
        .subscribe((result) => {
          //this.paymentReports = result;
          // Se filtran los reportes que no son de Echeq
          this.paymentReports = _.filter(
            result,
            (x) => x.type == EMedioDePago.ECHEQ
          );
          this.filteredPaymentReports = _.cloneDeep(this.paymentReports);
          this.selectedDatesChanged = false;

          this.echeqReports = this.mapEcheqReports(this.paymentReports);
          this.filteredEcheqReports = _.cloneDeep(this.echeqReports);
        });
    }
  }

  //
  // MANIPULACIÓN DE DATOS
  //

  filterByDate() {
    this.filteredByDate = true;
    this.filterOrdersByDate(this.filteredPaymentReports);
  }

  filterOrdersByDate(list: PaymentReport[]) {
    this.filteredPaymentReports = list.filter((x) => {
      const expirationDate = moment(
        new Date(x.reportDate).toLocaleDateString(),
        "DD/MM/YYYY"
      );
      return expirationDate.isBetween(
        this.dateDesde,
        this.dateHasta,
        undefined,
        "[]"
      );
    });
  }

  //
  // FILTROS
  //

  filter(value: string) {
    this.filteredEcheqReports = _.filter(
      this.echeqReports,
      (x) =>
        x.amount.toLowerCase().includes(value) ||
        x.cuit.toLowerCase().includes(value) ||
        x.currency.toLowerCase().includes(value) ||
        x.product.toLowerCase().includes(value) ||
        x.razonSocial.toLowerCase().includes(value) ||
        x.reportDate.toLowerCase().includes(value) ||
        x.reportDateVto.toLowerCase().includes(value) ||
        x.status.toLowerCase().includes(value) ||
        x.type.toLowerCase().includes(value)
    );
    this.cdr.detectChanges();
  }

  // selectPaymentReportsByType(inputType: EMedioDePago|string) {
  //   this.filteredByType = true;
  //   this.selectedType = inputType;
  //   this.filteredPaymentReports = _.filter(this.paymentReports, x => x.type == this.selectedType);
  // }

  adjustDate() {
    if (!this.dateDesde && this.dateHasta) {
      this.dateDesde = this.dateHasta;
    } else if (this.dateHasta) {
      let desde = moment(this.dateDesde, "DD/MM/YYYY");
      let hasta = moment(this.dateHasta, "DD/MM/YYYY");
      if (hasta.isBefore(desde)) this.dateHasta = this.dateDesde;
    } else {
      this.dateHasta = this.dateDesde;
    }

    this.selectedDatesChanged = true;
  }

  //
  // UTILIDADES
  //

  mapEcheqReports(paymentReports: PaymentReport[]) {
    let echeqReports = _.map(paymentReports, (x) => {
      let echeq = new EcheqReport();
      echeq.reportDate = moment(x.reportDate).calendar();
      echeq.cuit = x.cuit;
      echeq.razonSocial = x.razonSocial;
      echeq.currency = this.parseCurrencyType(x.currency);
      echeq.amount = x.amount.toString();
      echeq.type = this.parseMedioDePago(x.type);
      echeq.product = x.product;
      echeq.status = this.parseStatus(x.status);
      echeq.reportDateVto = moment(x.reportDateVto).calendar();
      return echeq;
    });

    return echeqReports;
  }

  parseStatus(status: EPaymentReportStatus) {
    return EPaymentReportStatus[status];
  }

  parseCurrencyType(code: any) {
    return ECurrency[code];
  }

  parseMedioDePago(code: any) {
    return EMedioDePago[code];
  }

  validReportDateVto(date: any) {
    let rowDate = new Date(date).toISOString();
    let minDate = new Date("0001,01,01").toISOString();
    return rowDate > minDate ? true : false;
  }
}
