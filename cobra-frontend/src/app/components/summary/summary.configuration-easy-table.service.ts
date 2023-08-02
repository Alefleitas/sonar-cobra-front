import { Injectable } from '@angular/core';
import { Config, STYLE, THEME } from 'ngx-easy-table';

@Injectable()
export class ConfigEasyTableService {

  public static configurationBalance: Config = {
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

  public static configNested: Config = {
    searchEnabled: false,
    headerEnabled: true,
    orderEnabled: false,
    paginationEnabled: true,
    exportEnabled: false,
    clickEvent: true,
    selectRow: false,
    selectCol: false,
    selectCell: false,
    rows: 10,
    additionalActions: false,
    serverPagination: false,
    isLoading: false,
    detailsTemplate: true,
    groupRows: false,
    paginationRangeEnabled: true,
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

  public static configNestedDetails: Config = {
    searchEnabled: false,
    headerEnabled: true,
    orderEnabled: false,
    paginationEnabled: false,
    exportEnabled: false,
    clickEvent: false,
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
      style: STYLE.TINY,
      theme: THEME.DARK,
      borderless: false,
      hover: true,
      striped: false,
    },
  };

  public static  columns = [
    { key: 'comprobanteTipo', title: 'Tipo',  width: '15%' },
    { key: 'comprobante', title: 'Nro transacción',  width: '25%' },
    { key: 'fecha', title: 'Fecha de vencimiento',  width: '20%' },
    { key: 'moneda', title: 'Moneda', width: '10%' },
    { key: 'haber', title: 'Importe',  width: '10%' },
    { key: 'saldo', title: 'Saldo',  width: '20%' }
  ];

  public static  columnsBalance = [
    { key: 'estado', title: 'Estado', width: '12,5%', cssClass: { 'name': 'Estado', 'includeHeader': false} },
    { key: 'pagar', title: 'Pagar',  width: '5%', cssClass: { 'name': 'Pagar', 'includeHeader': false} },
    { key: 'fecha', title: 'Fecha de vencimiento', width: '10%', cssClass: { 'name': 'Fecha de vencimiento', 'includeHeader': false} },
    { key: 'moneda', title: 'Moneda', width: '10%', cssClass: { 'name': 'Moneda', 'includeHeader': false} },
    { key: 'saldo', title: 'Saldo', width: '12,5%', cssClass: { 'name': 'Saldo', 'includeHeader': false} },
    { key: 'intereses', title: 'Intereses', width: '12,5%', cssClass: { 'name': 'Intereses', 'includeHeader': false} },
    { key: 'capital', title: 'Capital', width: '12,5%', cssClass: { 'name': 'Capital', 'includeHeader': false} },
    { key: 'trxNumber', title: 'Nro Factura', width: '12,5%', cssClass: { 'name': 'Nro Factura', 'includeHeader': false} },
    { key: 'invoice', title: 'Factura', width: '12,5%', cssClass: { 'name': 'Factura', 'includeHeader': false} }
  ];

  public static  columnsNested = [
    { key: 'fechaVenc', title: 'Fecha Vencimiento', width: '22.5%', cssClass: { 'name': 'Fecha Vencimiento', 'includeHeader': false}},
    { key: 'moneda', title: 'Moneda', width: '22.5%', cssClass: { 'name': 'Moneda', 'includeHeader': false}},
    { key: 'importe', title: 'Importe', width: '22.5%', cssClass: { 'name': 'Importe', 'includeHeader': false}},
    { key: 'saldo', title: 'Saldo', width: '20%', cssClass: { 'name': 'Saldo', 'includeHeader': false}},
    { key: 'action', title: 'Ver detalles', width: '12.5%', cssClass: { 'name': 'Ver detalles', 'includeHeader': false}}
  ];

  public static columnsNestedDetails = [
    { key: 'tipo', title: 'Tipo', cssClass: { 'name': 'Tipo', 'includeHeader': false}},
    { key: 'fecha', title: 'Fecha de pago', cssClass: { 'name': 'Fecha de pago', 'includeHeader': false}},
    { key: 'importe', title: 'Importe recibido', cssClass: { 'name': 'Importe recibido', 'includeHeader': false}},
    { key: 'moneda', title: 'Moneda', cssClass: { 'name': 'Moneda', 'includeHeader': false}},
    { key: 'importeFC', title: 'Importe Aplic. FC', cssClass: { 'name': 'Importe Aplic. FC', 'includeHeader': false}},
    { key: 'monedaFC', title: 'Moneda FC', cssClass: { 'name': 'Moneda FC', 'includeHeader': false}},
    { key: 'docNumber', title: 'Nro Recibo', cssClass: { 'name': 'Nro Recibo', 'includeHeader': false}},
    { key: 'receipt', title: 'Recibo', cssClass: { 'name': 'Recibo', 'includeHeader': false}},
    { key: 'trxNumber', title: 'Nro Factura', cssClass: { 'name': 'Nro Factura', 'includeHeader': false}},
    { key: 'invoice', title: 'Factura', cssClass: { 'name': 'Factura', 'includeHeader': false}},
    { key: 'applTc', title: 'Cotización', cssClass: { 'name': 'Cotización', 'includeHeader': false}}
  ]

  public static unappliedPaymentsColumns = [
    { key: 'fecha', title: 'Fecha', width: '20%', cssClass: { 'name': 'Fecha', 'includeHeader': false} },
    { key: 'importe', title: 'Importe', width: '30%', cssClass: { 'name': 'Importe', 'includeHeader': false} },
    { key: 'importeTc', title: 'Cotización', width: '20%', cssClass: { 'name': 'Cotización', 'includeHeader': false} },
    { key: 'operacion', title: 'Operacion', width: '20%', cssClass: { 'name': 'Operacion', 'includeHeader': false} },
    { key: 'conversion', title: 'Conversion', width: '10%', cssClass: { 'name': 'Conversion', 'includeHeader': false} }
  ]
}
