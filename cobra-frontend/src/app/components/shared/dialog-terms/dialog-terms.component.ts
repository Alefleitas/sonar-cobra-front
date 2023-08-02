import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';

export interface DialogData {
  title: string;
  message: string;
  btn: number;
  type: string;
  img: any;
  baseUrl: any;
}
@Component({
  selector: 'app-dialog-terms',
  templateUrl: './dialog-terms.component.html',
  styleUrls: ['./dialog-terms.component.scss']
})
export class DialogTermsComponent implements OnInit {
  disableBtn: boolean;
  imageUrl: any;

  constructor(
    public dialogRef: MatDialogRef<DialogTermsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private router: Router) { }

  ngOnInit() {
    this.disableBtn = true;

  }

  scrolled(obj: any) {
    if (obj.target.offsetHeight + Math.round(obj.target.scrollTop) === obj.target.scrollHeight) {
      this.disableBtn = false;
    } else {
      if ((obj.target.offsetHeight + Math.round(obj.target.scrollTop) + 1) === obj.target.scrollHeight ||
        (obj.target.offsetHeight + Math.round(obj.target.scrollTop) - 1) === obj.target.scrollHeight) {
        this.disableBtn = false;
      }
    }
  }

}
