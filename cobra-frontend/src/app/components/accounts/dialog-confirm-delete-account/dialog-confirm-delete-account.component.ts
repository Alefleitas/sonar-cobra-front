import {Component, Inject, OnInit} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccountBank } from 'src/app/models/account-bank';
import { AccountService } from 'src/app/services/account.service';
import { toaster } from 'src/app/app.component';
import { AccountsComponent, DialogData } from '../accounts.component';
import { DialogInfoComponent } from '../../dialog-info/dialog-info.component';

@Component({
  selector: 'app-dialog-confirm-delete-account',
  templateUrl: './dialog-confirm-delete-account.component.html',
  styleUrls: ['./dialog-confirm-delete-account.component.scss']
})
export class DialogConfirmDeleteAccountComponent implements OnInit {

  parent: AccountsComponent;
  account: AccountBank;

  constructor(
    private accountService: AccountService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogConfirmDeleteAccountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {
    this.account = this.data.account;
    this.parent = this.data.parent;
  }

  closePopUp(): void {
    this.dialogRef.close();
  }

  deleteAccount(){
    this.parent.isLoading = true;
    this.closePopUp();
    this.accountService.deleteAccount(this.account.id).subscribe( 
      () => {
        this.openDialog();
        this.parent.getAccounts();
      }, err => {
        this.parent.isLoading = false;
        toaster.error(
          `Ha ocurrido un error al intentar eliminar la cuenta.`,
          'Error '
        );
       }
       );
    }

    openDialog(): void {

      const text = `La cuenta <br />${this.account.cbu}<br /> fue eliminada con éxito.`;

      const dialogRef = this.dialog.open(DialogInfoComponent, {
        maxWidth: '300px',
        panelClass: 'dialog-responsive',
        data: {text: text, icon: "check_circle"}
      });
  
    }

}
