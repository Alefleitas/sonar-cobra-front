import { Injectable } from '@angular/core';
import { Config, STYLE, THEME } from 'ngx-easy-table';

@Injectable()
export class ConfigEasyTableService {

  public static configuration: Config = {
    searchEnabled: false,
    headerEnabled: true,
    orderEnabled: false,
    paginationEnabled: true,
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
    paginationMaxSize: 5,
    collapseAllRows: false,
    checkboxes: false,
    resizeColumn: false,
    fixedColumnWidth: false,
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
    { key: 'fechaPrimerVencimiento', title: 'Vencimiento'},
    { key: 'codigoMoneda', title: 'Moneda' },
    { key: 'saldoActual', title: 'Saldo' },
    { key: 'intereses', title: 'Intereses'},
    { key: 'importePrimerVenc', title: 'Capital'}
  ];
}