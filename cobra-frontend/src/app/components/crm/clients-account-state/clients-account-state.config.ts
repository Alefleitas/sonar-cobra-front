import { Injectable } from '@angular/core';
import { Config, STYLE, THEME, Columns } from 'ngx-easy-table';

@Injectable()
export class ConfigEasyTableService {
  public static configuration: Config = {
    searchEnabled: false,
    headerEnabled: true,
    orderEnabled: true,
    paginationEnabled: true,
    exportEnabled: true,
    clickEvent: true,
    selectRow: false,
    selectCol: false,
    selectCell: false,
    rows: 10,
    additionalActions: false,
    serverPagination: true,
    isLoading: false,
    detailsTemplate: false,
    groupRows: false,
    paginationRangeEnabled: true,
    paginationMaxSize: 5,
    collapseAllRows: false,
    checkboxes: false,
    resizeColumn: false,
    fixedColumnWidth: true,
    horizontalScroll: true,
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

  public static columns = [
    { key: 'actions', title: 'Acciones', width: '8.33%' },
    { key: 'project', title: 'Proyecto', width: '8.33%' },
    { key: 'product', title: 'Producto', width: '8.33%' },
    { key: 'name', title: 'Nombre', width: '18.33%', cssClass: {includeHeader: true, name: 'word-wrap'} },
    { key: 'departmentDesc', title: 'Gestión', width: '8.33%', },
    { key: 'balanceDesc', title: 'Estado', width: '8.33%', cssClass: {includeHeader: true, name: 'word-wrap'} },
    { key: 'salesInvoiceAmountUSD', title: 'Boleto U$S', width: '8.33%', cssClass: {includeHeader: false, name: 'text-right'} },
    { key: 'overduePaymentsCount', title: 'Cuotas Vencidas', width: '5%', cssClass: {includeHeader: true, name: 'word-wrap'}},
    { key: 'overduePaymentsAmountUSD', title: 'Deuda US$', width: '8.33%', cssClass: {includeHeader: false, name: 'custom-bg'} },
    { key: 'paidPaymentsCount', title: 'Cuotas pagadas', width: '5%', cssClass: {includeHeader: true, name: 'word-wrap'}},
    { key: 'paidPaymentsAmountUSD', title: 'Pagado U$S', width: '8.33%', cssClass: {includeHeader: false, name: 'custom-bg'} },
    { key: 'publishDebtDesc', title: 'Publica deuda', width: '5%', cssClass: {includeHeader: true, name: 'word-wrap'} }
  ];

}
