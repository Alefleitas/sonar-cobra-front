import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';
import { ECurrency } from 'src/app/models';
import { EAdvanceFeeStatus } from 'src/app/models/summary-advance';

@Component({
  selector: 'app-confirm-orders-status',
  templateUrl: './confirm-orders-status.component.html',
  styleUrls: ['./confirm-orders-status.component.scss']
})
export class ConfirmOrdersStatusComponent implements OnInit {


  constructor(
    public dialogRef: MatDialogRef<ConfirmOrdersStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { itemsToShow: any[] }
  ) { }

  ngOnInit(): void {

  }

  getCurrencyType(code: any) {
    return ECurrency[code];
  }

  closeDialog(action: string = ""): void {
    this.dialogRef.close(action);
  }

  parseStatus(status: EAdvanceFeeStatus) {
    return EAdvanceFeeStatus[status];
  }

  enableReasonRejectionBox(fee: any): boolean {
    return (fee.updatedStatus === EAdvanceFeeStatus.Rechazado);
  }

  onMotivoRechazoInput(value: string, order: any[]) {

    order.forEach((item: any) => {
      item.motivoRechazo = value;
    });
  }

}
