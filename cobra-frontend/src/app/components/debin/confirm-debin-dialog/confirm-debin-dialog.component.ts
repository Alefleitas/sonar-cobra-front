import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ECurrency } from 'src/app/models';
import { InformDebin } from 'src/app/models/debin';

@Component({
  selector: 'app-confirm-debin-dialog',
  templateUrl: './confirm-debin-dialog.component.html',
  styleUrls: ['./confirm-debin-dialog.component.scss']
})
export class ConfirmDebinDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDebinDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {groupedDebins: any[]}
  ) { }

  ngOnInit(): void {
  }

  getCurrencyType(code: any) {
    return ECurrency[code];
  }

  closeDialog(action: string = ""): void {
    this.dialogRef.close(action);
  }

}
