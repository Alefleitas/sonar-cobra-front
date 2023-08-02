import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { Columns, Config, STYLE, THEME } from 'ngx-easy-table';

@Component({
  selector: 'app-table-product',
  templateUrl: './table-product.component.html',
  styleUrls: ['./table-product.component.scss']
})
export class TableProductComponent implements OnInit {

  @ViewChild('amountTotalPagado', { static: true }) amountTotalPagadoTemplate: TemplateRef<any>;
  @ViewChild('amountMontoTotal', { static: true }) amountMontoTotalTemplate: TemplateRef<any>;
  @ViewChild('amountSaldoPendiente', { static: true }) amountSaldoPendienteTemplate: TemplateRef<any>;
  @ViewChild('summary', { static: true }) summaryTemplate: TemplateRef<any>;

  @Input() data: any;

  columns: Columns[] = [
    { key: 'montoTotal', title: 'Monto total', cssClass: { 'name': 'Monto total', 'includeHeader': false}},
    { key: 'totalPagado', title: 'Total pagado', cssClass: { 'name': 'Total pagado', 'includeHeader': false}},
    { key: 'saldoPendiente', title: 'Saldo pendiente', cssClass: { 'name': 'Saldo pendiente', 'includeHeader': false} },
    { key: 'summary', title: 'Ver resumen', cssClass: { 'name': 'Ver resumen', 'includeHeader': false} }
  ];

  configuration: Config = {
    searchEnabled: false,
    headerEnabled: true,
    orderEnabled: false,
    paginationEnabled: false,
    exportEnabled: false,
    clickEvent: true,
    selectRow: false,
    selectCol: false,
    selectCell: false,
    rows: 50,
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

  constructor() { }

  ngOnInit(): void {

    _.forEach(this.columns, col => {
      if (col.key === 'totalPagado'){
        col['cellTemplate'] = this.amountTotalPagadoTemplate;
      } else if(col.key === 'saldoPendiente'){
        col['cellTemplate'] = this.amountSaldoPendienteTemplate;
      } else if(col.key === 'montoTotal'){
        col['cellTemplate'] = this.amountMontoTotalTemplate;
      } else if(col.key === 'summary'){
        col['cellTemplate'] = this.summaryTemplate;
      }
    });

  }

  ngAfterViewChecked(){
    const data_labels = document.querySelectorAll("tbody tr td");
    Array.from(data_labels).forEach(x => {
      x.classList.remove("ng-star-inserted")
      x.classList.remove("no-results")
    })
  }

}
