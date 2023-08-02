import { Component, Inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service';
import { Columns, Config } from 'ngx-easy-table';
import { ConfigEasyTableService } from './../summary.configuration-easy-table.service';
import { PaymentDetail } from 'src/app/models';
import { toaster } from 'src/app/app.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-details-table',
  templateUrl: './details-table.component.html',
  styleUrls: ['./details-table.component.scss']
})
export class DetailsTableComponent implements OnInit {


  @Input() data: PaymentDetail[] = [];

  @ViewChild('importeDetail') importeDetail: TemplateRef<any>;
  @ViewChild('importeFcDetail') importeFcDetail: TemplateRef<any>;
  @ViewChild('receipt', { static: true }) receipt: TemplateRef<any>;
  @ViewChild('docNumber', { static: true }) docNumber: TemplateRef<any>;
  @ViewChild('invoiceApplicationDetail', { static: true }) invoiceApplicationDetail: TemplateRef<any>;
  @ViewChild('applicationTrxNumber', { static: true }) applicationTrxNumber: TemplateRef<any>;
  @ViewChild('applTc', { static: true }) applTc: TemplateRef<any>;

  columnsNestedDetails: Columns[];
  configNestedDetail: Config;

  constructor(private paymentService: PaymentService){
  }

  ngOnInit(): void {
    this.columnsNestedDetails = ConfigEasyTableService.columnsNestedDetails;
    this.configNestedDetail = ConfigEasyTableService.configNestedDetails;
    this.configNestedDetail.detailsTemplate = true;
    this.configNestedDetail.fixedColumnWidth = true;
  }

  ngAfterViewInit(){
    _.forEach(this.columnsNestedDetails, col => {
      if (col.key === 'importe')
        col['cellTemplate'] = this.importeDetail;
      if (col.key === 'importeFC')
        col['cellTemplate'] = this.importeFcDetail;
      if (col.key === 'receipt')
        col['cellTemplate'] = this.receipt;
      if (col.key === 'docNumber')
        col['cellTemplate'] = this.docNumber;
      if (col.key === 'invoice')
        col['cellTemplate'] = this.invoiceApplicationDetail;
      if (col.key === 'trxNumber')
        col['cellTemplate'] = this.applicationTrxNumber;
      if (col.key === 'applTc')
        col['cellTemplate'] = this.applTc;
    });
  }

  ngAfterViewChecked(){
    const data_labels = document.querySelectorAll("tbody tr td");
    Array.from(data_labels).forEach(x => {
      x.classList.remove("ng-star-inserted")
      x.classList.remove("no-results")
    })
  }

  downloadReceipt(row: PaymentDetail) {
    row["isLoading"] = true;
    this.paymentService.getReceipt(row.buId, row.docId, row.legalEntityId).subscribe(res=> {
     const linkSource = 'data:application/pdf;base64,' + res;
        const downloadLink = document.createElement("a");
        //const fileName =  row.buId + "_" + row.docId + "_" + row.legalEntityId + ".pdf";
        const fileName =  `${row.docNumber}_.pdf`;

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
        row["isLoading"] = false;
    }, error => {
      row["isLoading"] = false;
      toaster.error(
        `Póngase en contacto con su administrador para obtener más información: ${error.message}`,
        'Error '
      );
    });
  }

  downloadInvoice(row:PaymentDetail){
    row["isInvoiceLoading"] = true;
    this.paymentService.getInvoice(row.trxId, row.facElect).subscribe(res=>{
     const linkSource = 'data:application/pdf;base64,' + res;
        const downloadLink = document.createElement("a");
        const fileName =  row.trxNumber + ".pdf";

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
        row["isInvoiceLoading"] = false;
    }, error=> {
      row["isInvoiceLoading"] = false;
      toaster.error(
        `Póngase en contacto con su administrador para obtener más información: ${error.message}`,
        'Error '
      );
    });
  }

}
