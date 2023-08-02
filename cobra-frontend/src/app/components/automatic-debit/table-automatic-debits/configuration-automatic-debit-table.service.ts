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

  public static columnsForAdmin = [
    { key: 'user', title: 'Usuario' },
    { key: 'name', title: 'Nombre' },
    { key: 'entrepreneurship', title: 'Producto' },
    { key: 'client', title: 'Cliente' },
    { key: 'currency', title: 'Moneda' },
    { key: 'cbu', title: 'CBU' },
    { key: 'adhereDebit', title: 'Adherido', width: '80px' }
  ];

  public static columnsForUser = [
    { key: 'entrepreneurship', title: 'Producto' },
    { key: 'client', title: 'Cliente' },
    { key: 'currency', title: 'Moneda' },
    { key: 'cbu', title: 'CBU' },
    { key: 'adhereDebit', title: 'Adherido', width: '80px' }
  ];
}
