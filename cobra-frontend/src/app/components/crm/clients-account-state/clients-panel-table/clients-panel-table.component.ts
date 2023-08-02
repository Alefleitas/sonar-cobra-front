import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { Columns, Config, STYLE, THEME } from 'ngx-easy-table';
import { EBalance, EDelayStatus, EDepartment } from 'src/app/models/account-balance';

@Component({
  selector: 'app-clients-panel-table',
  templateUrl: './clients-panel-table.component.html',
  styleUrls: ['./clients-panel-table.component.scss']
})
export class ClientsPanelTableComponent implements OnInit {

  @ViewChild('tableClient') tableClient: any;
  @ViewChild('departmentTemplate') departmentTemplate: TemplateRef<any>;
  @ViewChild('delayStatusTemplate') delayStatusTemplate: TemplateRef<any>;
  @ViewChild('publishDebtTemplate') publishDebtTemplate: TemplateRef<any>;
  @ViewChild('workStartedTemplate') workStartedTemplate: TemplateRef<any>;
  @ViewChild('totalDebtAmount') totalDebtAmount: TemplateRef<any>;
  @ViewChild('salesInvoiceAmountUSD') salesInvoiceAmountUSD: TemplateRef<any>;
  @ViewChild('paidPaymentsAmountUSD') paidPaymentsAmountUSD: TemplateRef<any>;
  @ViewChild('overduePaymentsAmountUSD') overduePaymentsAmountUSD: TemplateRef<any>;
  @ViewChild('futurePaymentsAmountUSD') futurePaymentsAmountUSD: TemplateRef<any>;

  @Input() isLoading: boolean;
  @Input() arrayData: any = [];

  @Output() parentCancel = new EventEmitter<any>();
  @Output() parentSave = new EventEmitter<any>();
  @Output() parentShowCommunications = new EventEmitter<any>();
  @Output() parentShowOverduePayments = new EventEmitter<any>();

  public configurationMobile: Config = {
    searchEnabled: false,
    headerEnabled: true,
    orderEnabled: false,
    paginationEnabled: false,
    exportEnabled: false,
    clickEvent: true,
    selectRow: false,
    selectCol: false,
    selectCell: false,
    rows: 10,
    additionalActions: false,
    serverPagination: false,
    isLoading: false,
    detailsTemplate: false,
    groupRows: false,
    paginationRangeEnabled: false,
    paginationMaxSize: 5,
    collapseAllRows: false,
    checkboxes: false,
    resizeColumn: false,
    fixedColumnWidth: true,
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

  public columnsMobile: Columns[] = [
    { key: 'project', title: 'Proyecto', cssClass: { 'name': 'Proyecto', 'includeHeader': false} },
    { key: 'departmentDesc', title: 'Gestión', cssClass: { 'name': 'Gestión', 'includeHeader': false} },
    { key: 'balanceDesc', title: 'Estado', cssClass: { 'name': 'Estado', 'includeHeader': false} },
    { key: 'salesInvoiceAmountUSD', title: 'Boleto U$S', cssClass: { 'name': 'Boleto U$S', 'includeHeader': false} },
    { key: 'overduePaymentsCount', title: 'Cuotas Vencidas', cssClass: { 'name': 'Cuotas Vencidas', 'includeHeader': false} },
    { key: 'overduePaymentsAmountUSD', title: 'Deuda US$', cssClass: { 'name': 'Deuda US$', 'includeHeader': false} },
    { key: 'paidPaymentsCount', title: 'Cuotas pagadas', cssClass: { 'name': 'Cuotas pagadas', 'includeHeader': false} },
    { key: 'paidPaymentsAmountUSD', title: 'Pagado U$S', cssClass: { 'name': 'Pagado U$S', 'includeHeader': false} },
    { key: 'publishDebtDesc', title: 'Publica deuda', cssClass: { 'name': 'Publica deuda', 'includeHeader': false} }
  ]
  
  eDepartment = EDepartment;
  eBalance = EBalance;
  eDelayStatus = EDelayStatus;

  constructor() { }

  ngOnInit(): void {

    _.forEach(this.columnsMobile, col => {
      if (col.key === 'departmentDesc')
        col['cellTemplate'] = this.departmentTemplate;
      if (col.key === 'delayStatusDesc')
        col['cellTemplate'] = this.delayStatusTemplate;
      if (col.key === 'publishDebtDesc')
        col['cellTemplate'] = this.publishDebtTemplate;
      if (col.key === 'workStartedDesc')
        col['cellTemplate'] = this.workStartedTemplate;
      if (col.key === 'totalDebtAmount')
        col['cellTemplate'] = this.totalDebtAmount;
      if (col.key === 'salesInvoiceAmountUSD')
        col['cellTemplate'] = this.salesInvoiceAmountUSD;
      if (col.key === 'paidPaymentsAmountUSD')
        col['cellTemplate'] = this.paidPaymentsAmountUSD;
      if (col.key === 'overduePaymentsAmountUSD')
        col['cellTemplate'] = this.overduePaymentsAmountUSD;
      if (col.key === 'futurePaymentsAmountUSD')
        col['cellTemplate'] = this.futurePaymentsAmountUSD;
    });
  }

  ngAfterViewChecked(){
    const data_labels = document.querySelectorAll("tbody tr td");
    Array.from(data_labels).forEach(x => {
      x.classList.remove("ng-star-inserted")
      x.classList.remove("no-results")
    })
  }

  canSaveRow(row){
    row.newDataToSave = true;
  }

  edit(row) {
    row.isEditing = true;
  }

  editWorkStarted(row) {
    row.isEditingWorkStarted = true;
  }

  save(value) {
    this.parentSave.emit(value);
  }

  cancel(value) {
    this.parentCancel.emit(value);
  }

  showCommunications(value) {
    this.parentShowCommunications.emit(value);
  }

  showOverduePayments(value) {
    this.parentShowOverduePayments.emit(value);
  }

}
