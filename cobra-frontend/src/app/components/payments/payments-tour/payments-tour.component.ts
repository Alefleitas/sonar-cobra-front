import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { Columns, Config, STYLE, THEME } from 'ngx-easy-table';
import { toaster } from 'src/app/app.component';

@Component({
  selector: 'app-payments-tour',
  templateUrl: './payments-tour.component.html',
  styleUrls: ['./payments-tour.component.scss']
})
export class PaymentsTourComponent implements OnInit {
  @ViewChild('fecha', { static: true }) fecha: TemplateRef<any>;
  @ViewChild('importe', { static: true }) importe: TemplateRef<any>;
  @ViewChild('action', { static: true }) action: TemplateRef<any>;

  inputNumber: number = 11111.11;

  public columns: Columns[];
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
    rows: 100,
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

  tourData: any[] = [
    {
      fecha: "11/11/1111",
      importe: "$11.111,11",
      action: 'msg',
      canPay: false,
      pay: false,
      lastCheck: false,
      showEdit: false
    },
    {
      fecha: "11/11/1111",
      importe: "$11.111,11",
      action: 'edit',
      canPay: true,
      pay: false,
      lastCheck: false,
      showEdit: false
    },
    {
      fecha: "11/11/1111",
      importe: "$11.111,11",
      action: 'refresh',
      canPay: true,
      pay: false,
      lastCheck: true,
      showEdit: false
    },
    {
      fecha: "11/11/1111",
      importe: "$11.111,11",
      action: 'ok',
      canPay: true,
      pay: false,
      lastCheck: true,
      showEdit: true
    }

  ]

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.columns = [
      {
        key: 'fecha',
        title: 'Fecha',
        cellTemplate: this.fecha,
        width: '25%',
        cssClass: { 'name': 'Fecha', 'includeHeader': false}
      },
      {
        key: 'importe',
        title: 'Importe',
        cellTemplate: this.importe,
        width: '50%',
        cssClass: { 'name': 'Importe', 'includeHeader': false}
        
      },
      {
        key: 'action',
        title: 'Pagar',
        cellTemplate: this.action,
        width: '25%',
        cssClass: { 'name': 'Pagar', 'includeHeader': false}
      }
    ];
  }

  ngAfterViewChecked(){
    const data_labels = document.querySelectorAll("tbody tr td");
    Array.from(data_labels).forEach(x => {
      x.classList.remove("ng-star-inserted")
      x.classList.remove("no-results")
    })
  }

  changeValue(index: any, value: boolean) {
    if (value) {
      for (let i = index; i < this.tourData.length; i++) {
        if (this.tourData[i].pay === true) this.tourData[i].pay = false;
      }
    }
    else {
      for (let i = index; i >= 0; i--) {
        if (this.tourData[i].canPay) this.tourData[i].pay = true;
      }
    }
  }
}
