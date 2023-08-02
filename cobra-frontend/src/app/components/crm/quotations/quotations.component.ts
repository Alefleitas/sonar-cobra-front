import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { quotationClasses, QuotationList } from "src/app/models/quotation";
import { QuotationService } from "src/app/services/quotation.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { toaster } from "src/app/app.component";
import * as _ from "lodash";
import * as moment from "moment";
/* NgRx */
import { Store } from "@ngrx/store";
import { State } from "src/app/state";
import { ExchangeRatePageActions } from "src/app/state/actions";
import { EPermission, User } from "src/app/models";
import { AuthGuard } from "src/app/core/guards";
import { PrincipalService } from "src/app/core/auth";
import { APIDefinition, Columns, Config, STYLE, THEME } from "ngx-easy-table";
import { QuotationHistory } from "src/app/models/quotation-history.model";
import * as XLSX from "xlsx";
import { forEach } from "lodash";
import { faL } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-quotations",
  templateUrl: "./quotations.component.html",
  styleUrls: ["./quotations.component.scss"],
})
export class QuotationsComponent implements OnInit {
  @ViewChild("dateQuotationFrom") dateQuotationFrom: TemplateRef<any>;
  @ViewChild("dateQuotationTo") dateQuotationTo: TemplateRef<any>;
  @ViewChild("rateType") rateType: TemplateRef<any>;
  @ViewChild("species") species: TemplateRef<any>;
  @ViewChild("uploadDate") uploadDate: TemplateRef<any>;
  @ViewChild("table", { static: true }) table: APIDefinition;

  isLoading: boolean = true;
  quotations: QuotationList[];
  lastQuotation: any;
  lastQuotationKeys: string[];
  currentQuotation: any;
  currentQuotationKeys: string[];
  selectedQuotation: string;
  dynamicFormGroup: FormGroup;
  dynamicFields: any[];
  rateTypes: string[] = [];
  currentUser: User;
  allHistoryQuotations: QuotationHistory[];
  moment: any = moment;

  isLoadingBonos: boolean = false;
  listaBonos: any[] = [];
  bonosSeleccionados = new FormControl();
  multipleRateTypes: boolean = false;

  columns: Columns[] = [
    { key: "uploadDate", title: "Fecha de carga", width: "250px" },
    { key: "effectiveDateFrom", title: "Fecha efectiva desde", width: "250px" },
    { key: "effectiveDateTo", title: "Fecha efectiva hasta", width: "250px" },
    { key: "rateType", title: "Tipo de cambio", width: "250px" },
    { key: "especie", title: "Especie", width: "100px" },
    { key: "valor", title: "Valor", width: "150px" },
  ];

  configuration: Config = {
    searchEnabled: false,
    headerEnabled: true,
    orderEnabled: false,
    paginationEnabled: true,
    exportEnabled: false,
    clickEvent: true,
    selectRow: false,
    selectCol: false,
    selectCell: false,
    rows: 12,
    additionalActions: false,
    serverPagination: false,
    isLoading: false,
    detailsTemplate: false,
    groupRows: false,
    paginationRangeEnabled: false,
    collapseAllRows: false,
    checkboxes: false,
    resizeColumn: false,
    fixedColumnWidth: false,
    horizontalScroll: false,
    draggable: false,
    logger: false,
    showDetailsArrow: false,
    showContextMenu: false,
    persistState: false,
    tableLayout: {
      style: STYLE.NORMAL,
      theme: THEME.LIGHT,
      borderless: false,
      hover: true,
      striped: false,
    },
  };

  constructor(
    private quotationService: QuotationService,
    private store: Store<State>,
    private authGuard: AuthGuard,
    private principalService: PrincipalService
  ) { }

  ngOnInit(): void {
    this.getQuotations();

    this.principalService.getIdentity().subscribe((user: User) => {
      this.currentUser = _.cloneDeep(user);
    });
  }

  ngAfterViewInit() {
    _.forEach(this.columns, (col) => {
      if (col.key === "uploadDate") col["cellTemplate"] = this.uploadDate;
      if (col.key === "effectiveDateFrom")
        col["cellTemplate"] = this.dateQuotationFrom;
      if (col.key === "effectiveDateTo")
        col["cellTemplate"] = this.dateQuotationTo;
      if (col.key === "rateType") col["cellTemplate"] = this.rateType;
      if (col.key === "especie") col["cellTemplate"] = this.species;
    });
  }

  getQuotations() {
    this.isLoading = true;
    this.quotationService.getQuotations().subscribe(
      (x: QuotationList[]) => {
        this.quotations = _.filter(
          x,
          (quotation) => !quotation.code.includes("QuotationExternal")
        );
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
        toaster.error(
          `Póngase en contacto con su administrador para obtener más información: ${err.message}`,
          "Error "
        );
      }
    );
  }

  selectQuotation(selected: string) {
    if (selected !== "Seleccionar...") {
      this.selectedQuotation = selected;
      this.isLoading = true;

      if (this.selectedQuotation === "DolarMEP") {
        this.isLoadingBonos = true;
        this.quotationService.getBonosConfiguration().subscribe(
          (res) => {
            this.listaBonos = _.orderBy(res, ["title"], ["asc"]);
            this.isLoadingBonos = false;
          },
          (error) => {
            this.isLoadingBonos = false;
            toaster.error(
              `No se pudo obtener la lista bonos: ${error.message}`,
              "Error "
            );
          }
        );
      } else {
        this.listaBonos = [];
      }

      this.configuration.isLoading = true;

      this.quotationService.getAllQuotation(selected).subscribe((res) => {
        this.allHistoryQuotations = res;
        this.rateTypes = _.keys(
          _.groupBy(this.allHistoryQuotations, (x) => x.rateType)
        );
        this.multipleRateTypes = this.rateTypes.length > 1 ? true : false;

        if (!this.multipleRateTypes) {
          this.quotationService.getCurrentQuotation(selected).subscribe((x) => {
            this.currentQuotation = x;
            this.currentQuotationKeys = x
              ? _.difference(Object.keys(this.currentQuotation), [
                "id",
                "source",
                "uploadDate",
                "userId",
              ])
              : undefined;
          });
          this.quotationService.getLastQuotation(selected).subscribe((x) => {
            this.configuration.isLoading = this.isLoading = false;
            this.lastQuotation = x;
            this.lastQuotationKeys = _.difference(
              Object.keys(this.lastQuotation),
              ["id", "source", "userId"]
            );
          });
        }

        var quotation = _.find(this.quotations, (q) => q.code === selected);
        if (quotation) {
          let group = {};
          this.dynamicFields = _.map(
            _.omit(quotation.data, [
              "id",
              "source",
              "effectiveDateTo",
              "uploadDate",
              "userId",
            ]),
            (value, key) => {
              return {
                key,
                type:
                  key === "rateType"
                    ? "multiselect"
                    : key === "uploadDate" || key === "effectiveDateFrom"
                      ? "date"
                      : key === "description" || "especie"
                        ? "text"
                        : "number",
                value: key === "rateType" ? this.rateTypes : value
              };
            }
          );
          _.forEach(this.dynamicFields, (df) => {
            if (["toCurrency", "fromCurrency"].includes(df.key))
              group[df.key] = new FormControl({
                value: df.value,
                disabled: true,
              });
            else group[df.key] = new FormControl("", Validators.required);
          });
          this.dynamicFormGroup = new FormGroup(group);
        } else {
          this.dynamicFormGroup = undefined;
          this.selectedQuotation = undefined;
          this.lastQuotationKeys = undefined;
        }

        this.configuration.isLoading = this.isLoading = false;
      });
    } else {
      this.selectedQuotation = undefined;
      this.dynamicFormGroup = undefined;
      this.dynamicFields = undefined;
      this.currentQuotationKeys = undefined;
      this.lastQuotationKeys = undefined;
      this.currentQuotation = undefined;
      this.lastQuotation = undefined;
    }
  }

  onSubmit() {
    if (!isNaN(this.dynamicFormGroup.value.valor)) {
      // dynamically creates a new instance of class and assigns provided source from selectedQuotation type
      var newQuotation = new quotationClasses[this.selectedQuotation](
        this.dynamicFormGroup.value
      );

      this.isLoading = true;
      this.quotationService
        .addQuotation(this.selectedQuotation, newQuotation)
        .subscribe(
          (newQuotation) => {
            if (newQuotation) {
              if (this.selectedQuotation === "UVA") {
                let today = moment().format("DD/MM/YYYY");
                let quotationDate = moment(
                  newQuotation.effectiveDateFrom
                ).format("DD/MM/YYYY");
                if (today === quotationDate)
                  this.store.dispatch(
                    ExchangeRatePageActions.setUvaExchangeRate({
                      uvaValue: newQuotation.valor,
                    })
                  );
              }
              this.selectedQuotation = undefined;
              this.dynamicFields = undefined;
              this.dynamicFormGroup = undefined;
              this.currentQuotationKeys = undefined;
              this.lastQuotationKeys = undefined;
              this.currentQuotation = undefined;
              this.lastQuotation = undefined;
              this.getQuotations();
            }
          },
          (err) => {
            this.isLoading = false;
            toaster.error(
              `Póngase en contacto con su administrador para obtener más información: ${err.message}`,
              "Error "
            );
          }
        );
    } else {
      toaster.error(
        `El valor debe ser un número (Decimales con punto)`,
        "Error "
      );
    }
  }

  canAccessCreateQuotation(): boolean {
    return this.authGuard.isAllowed(
      [EPermission.Create_Quotation],
      this.currentUser
    );
  }

  exportToExcel(quotations: any[]): void {
    // Here is simple example how to export to excel by https://www.npmjs.com/package/xlsx
    try {
      /* generate worksheet */
      // removes unnecesary fields
      let dataToExport = _.map(quotations, (d) => {
        const row = _.omit(d, ["id"]);
        row.uploadDate = moment(row.uploadDate).format("DD/MM/YYYY HH:mm");
        row.effectiveDateFrom = moment(row.effectiveDateFrom).format(
          "DD/MM/YYYY HH:mm"
        );
        row.effectiveDateTo = moment(row.effectiveDateTo).format(
          "DD/MM/YYYY HH:mm"
        );
        return row;
      });

      // 'especie' column fixed as A1 header
      let dataToExportFixed = _.unionWith(
        [{ especie: "" }],
        dataToExport,
        _.isEqual
      );

      // let headers = [];
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExportFixed);

      // renaming headers
      ws.A1.v = "Especie";
      ws.B1.v = "Descripción";
      ws.C1.v = "Fecha de carga";
      ws.D1.v = "Fecha efectiva desde";
      ws.E1.v = "Fecha efectiva hasta";
      ws.F1.v = "Id Usuario";
      ws.G1.v = "Tipo de cambio";
      ws.H1.v = "Conversión de";
      ws.I1.v = "Conversión a";
      ws.J1.v = "Valor";
      ws.K1.v = "Fuente";

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      /* save to file */
      XLSX.writeFile(
        wb,
        `Histórico de cotizaciones ${this.selectedQuotation
        } al ${moment().format("DD-MM-YYYY HH:mm")}.xlsx`
      );
    } catch (err) {
      toaster.error(
        `Ocurrió un error al exportar en Excel: ${err.message}`,
        "Error "
      );
    }
  }

  checkBonosSeleccionados() {
    return (
      this.bonosSeleccionados.value === null ||
      this.bonosSeleccionados.value?.length === 0
    );
  }

  calcularPromedioBonos() {
    let summ = this.bonosSeleccionados.value.reduce(
      (total, item) => total + item.value,
      0
    );
    return (summ / this.bonosSeleccionados.value.length).toFixed(2);
  }

  publishBonos() {
    this.isLoadingBonos = true;
    let bonosConfig = [];
    this.bonosSeleccionados.value.forEach((x) => {
      bonosConfig.push({ id: x.id, title: x.title.split(" | ")[0] });
    });

    this.quotationService.postBonosConfiguration(bonosConfig).subscribe(
      (x) => {
        this.bonosSeleccionados = new FormControl();
        this.isLoadingBonos = false;
        toaster.success(
          `Se ha configurado el dólar MEP correctamente`,
          "Éxito "
        );
        this.selectQuotation("DolarMEP");
      },
      (error) => {
        this.isLoadingBonos = false;
        toaster.error(
          `No se ha podido configurar el dólar MEP: ${error.message}`,
          "Error "
        );
      }
    );
  }
}
