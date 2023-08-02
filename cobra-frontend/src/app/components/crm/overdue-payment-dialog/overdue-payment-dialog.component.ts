import { Component, OnInit, Inject, ViewChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { ConfigEasyTableService } from './overdue-payment-dialog.config';
import { Columns, Config } from 'ngx-easy-table';
import * as _ from 'lodash';
import { AccountBalanceService } from 'src/app/services/account-balance.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { PaymentDetail } from 'src/app/models';
import * as XLSX from 'xlsx';
import { toaster } from 'src/app/app.component';

@Component({
  selector: 'app-overdue-payment-dialog',
  templateUrl: './overdue-payment-dialog.component.html',
  styleUrls: ['./overdue-payment-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class OverduePaymentDialogComponent implements OnInit {

  @ViewChild('fechaPrimerVencimiento', { static: true }) fechaPrimerVencimiento: TemplateRef<any>;
  @ViewChild('importePrimerVenc', { static: true }) importePrimerVenc: TemplateRef<any>;
  @ViewChild('saldoActual', { static: true }) saldoActual: TemplateRef<any>;
  @ViewChild('intereses', { static: true }) intereses: TemplateRef<any>; //

  accountBalanceId: number;
  columns: Columns[];
  configuration: Config;
  paymentDetails: any[];
  filteredPaymentDetails: any[];
  filters = {
    isOverdue: -1
  };
  isLoading: boolean = false;
  isExporting: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private accountBalanceService: AccountBalanceService
  ) {
    this.paymentDetails = new Array<any>();
    this.filteredPaymentDetails = new Array<any>();
    this.columns = ConfigEasyTableService.columns;
    this.configuration = ConfigEasyTableService.configuration;
    this.accountBalanceId = data.accountBalanceId;
  }

  ngOnInit() {
    _.forEach(this.columns, col => {
      if (col.key === 'fechaPrimerVencimiento')
        col['cellTemplate'] = this.fechaPrimerVencimiento;
      else if (col.key === 'saldoActual')
        col['cellTemplate'] = this.saldoActual;
      else if (col.key === 'intereses')
        col['cellTemplate'] = this.intereses;
      else if (col.key === 'importePrimerVenc')
        col['cellTemplate'] = this.importePrimerVenc;
    });
    this.isLoading = true;
    this.accountBalanceService.getPaymentDetails(this.accountBalanceId).subscribe(result => {
      this.paymentDetails = [...result];
      this.filteredPaymentDetails = [...this.paymentDetails];
      this.isLoading = false;
    });
  }

  applyFilters() {
    //Necesitamos la referencia al this actual para pasarselo al callback de filter
    var self = this;
    this.filteredPaymentDetails = this.paymentDetails
      .filter(this.filterPaymentsByIsOverdue, self);
  }

  private filterPaymentsByIsOverdue(paymentDetail: any) {
    if (this.filters.isOverdue === -1) {
      return true;
    } else if (this.filters.isOverdue === 0) {
      return moment(paymentDetail.fechaPrimerVencimiento, 'YYYY-MM-DD').toDate() <= moment().toDate();
    } else {
      return moment(paymentDetail.fechaPrimerVencimiento, 'YYYY-MM-DD').toDate() >= moment().toDate();
    }
  }

  exportToExcel(): void {
    // Here is simple example how to export to excel by https://www.npmjs.com/package/xlsx
    try {
      /* generate worksheet */
      let dataToExport = this.paymentDetails.map(item => {
        let up = new Object();
        up['vencimiento'] = item.fechaPrimerVencimiento;
        up['moneda'] = item.codigoMoneda;
        up['saldo'] = item.saldoActual;
        up['intereses'] = item.intereses;
        up['capital'] = item.importePrimerVenc;
        return up;
      });

      //let headers = [];
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);

      //renaming headers
      ws.A1.v = 'Vencimiento';
      ws.B1.v = 'Moneda';
      ws.C1.v = 'Saldo';
      ws.D1.v = 'Intereses';
      ws.E1.v = 'Capital';

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wb, `Deuda de (${this.data.product}) ${this.data.name}.xlsx`);
      this.isExporting = false;
    } catch (err) {
      toaster.error(`Ocurrió un error al exportar en Excel: ${err.message}`, 'Error ');
      this.isExporting = false;
    }
  }

}
