import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';
import { API, APIDefinition, Columns, Config, STYLE, THEME } from 'ngx-easy-table';
import { PaymentService } from 'src/app/services/payment.service';
import { ConfigEasyTableService } from '../../reports.configuration-easy-table.service';
import { DetailsReportTableComponent } from '../details-report-table/details-report-table.component';

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.scss']
})
export class ReportTableComponent implements OnInit {

  @Input() receivedData: any[] = []; 

  @ViewChild("tableReport") tableReport: APIDefinition;

  columns: Columns[] = [
    { key: "medioDePago", title: "Medio de Pago", width: "11%" },
    { key: "status", title: "Status", width: "11%" },
    { key: "currency", title: "Moneda", width: "11%" },
    { key: "importe", title: "Importe", width: "11%" },
    { key: "cuitCliente", title: "CUIT", width: "11%" },
    { key: "source", title: "Origen", width: "11%" },
    { key: "type", title: "Tipo", width: "11%" },
    { key: "fechaTransaccion", title: "Transacción", width: "13%" },
    { key: "detallesPago", title: "Detalles", width: "10%" },
  ];

  @ViewChild('detallesPago', { static: true }) detallesPago: TemplateRef<any>;
  @ViewChild('importe', { static: true }) importe: TemplateRef<any>;
  configuration: Config = ConfigEasyTableService.configurationReportTable;

  constructor(
    public paymentService: PaymentService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {  
      _.forEach(this.columns, col => {
        if (col.key === 'detallesPago')
          col['cellTemplate'] = this.detallesPago;
        if (col.key === 'importe')
          col['cellTemplate'] = this.importe;
      })    
  }

  filter(value: string) {
    this.tableReport.apiEvent({
      type: API.onGlobalSearch,
      value: value,
    });
  }

  openPaymentDetailModal(paymentMethod: any){
    this.dialog.open(DetailsReportTableComponent, {
      width: '700px',
      data: {paymentMethod: paymentMethod}
    });
  }
}
