import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-info',
  templateUrl: './dialog-info.component.html',
  styleUrls: ['./dialog-info.component.scss']
})
export class DialogInfoComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {
  }

  positiveAction(){
    this.dialogRef.close();
    this.data.componentAction.actionPositive();
  }

  closePopUp(): void {
    this.dialogRef.close();
    this.data.componentAction?.actionNegative();
  }

}
export interface ComponentActionDialog {
  actionPositive();
  actionNegative();
}
export interface DialogData {
  title?: string;
  text: string;
  icon: string;
  positiveButton?: string;
  negativeButton?: string;
  componentAction?: ComponentActionDialog;
}
