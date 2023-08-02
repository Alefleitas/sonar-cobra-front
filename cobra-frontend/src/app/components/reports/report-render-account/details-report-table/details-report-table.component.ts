import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Columns, Config } from 'ngx-easy-table';
import { PaymentService } from 'src/app/services/payment.service';
import { ConfigEasyTableService } from '../../reports.configuration-easy-table.service';
import { finalize } from 'rxjs/operators';
import { ReportPaymentDetail } from 'src/app/models/rendition-report';
import * as _ from 'lodash';

@Component({
  selector: 'app-details-report-table',
  templateUrl: './details-report-table.component.html',
  styleUrls: ['./details-report-table.component.scss']
})
export class DetailsReportTableComponent implements OnInit {

  isLoading: boolean;
  receivedPaymentMethod: any;
  paymentDetails: ReportPaymentDetail[];

  columns: Columns[] = [
    { key: "date", title: "Fecha de Acreditación", width: "15%" },
    { key: "instrument", title: "Instrumento", width: "20%" },
    { key: "importe", title: "Importe", width: "20%" },
    { key: "status", title: "Status", width: "20%" },
    { key: "errorDetail", title: "Error", width: "25%" },
  ];

  configuration: Config = ConfigEasyTableService.configurationDetailReportTable;

  @ViewChild('date', { static: true }) date: TemplateRef<any>;
  @ViewChild('instrument', { static: true }) instrument: TemplateRef<any>;
  @ViewChild('importe', { static: true }) importe: TemplateRef<any>;

  constructor(
    public paymentService: PaymentService,
    public dialogRef: MatDialogRef<DetailsReportTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.receivedPaymentMethod = data.paymentMethod;
  }

  ngOnInit(): void {
    this.isLoading = true;

    _.forEach(this.columns, col => {
      if (col.key === 'date')
        col['cellTemplate'] = this.date;
      if (col.key === 'instrument')
        col['cellTemplate'] = this.instrument;
      if (col.key === 'importe')
        col['cellTemplate'] = this.importe;
    });

    this.getPaymentDetail(this.receivedPaymentMethod.id)
  }

  closePopUp(): void {
    this.dialogRef.close();
  }

  getPaymentDetail(id: number){
    this.paymentService.getPaymentDetailByPaymentMethodId(id)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe(response => {
        this.paymentDetails = response;
      })
  }

}
