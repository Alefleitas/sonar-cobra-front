import { ViewChild } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Columns, Config, STYLE, THEME, APIDefinition, API } from 'ngx-easy-table';
import { AccountBank } from 'src/app/models/account-bank';
import { AccountService } from 'src/app/services/account.service';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmDeleteAccountComponent } from './dialog-confirm-delete-account/dialog-confirm-delete-account.component';
import { DialogAddAccountComponent } from '../dialog-add-account/dialog-add-account.component';
import { toaster } from 'src/app/app.component';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  @ViewChild('deleteAccount', { static: true }) deleteAccountTemplate: TemplateRef<any>;
  @ViewChild('currency', { static: true }) currencyTemplate: TemplateRef<any>;

  @ViewChild('table', { static: true }) table: APIDefinition;

  columns: Columns[] = [
    { key: 'cbu', title: 'CBU', width: '35%', cssClass: { 'name': 'CBU', 'includeHeader': false} },
    { key: 'cuit', title: 'CUIT', width: '30%', cssClass: { 'name': 'CUIT', 'includeHeader': false} },
    { key: 'currency', title: 'Moneda', width: '25%', cssClass: { 'name': 'Moneda', 'includeHeader': false} },
    { key: 'deleteAccount', title: 'Borrar', width: '10%', cssClass: { 'name': 'Borrar', 'includeHeader': false} }
  ];

  configurationAccounts: Config = {
    searchEnabled: false,
    headerEnabled: true,
    orderEnabled: false,
    paginationEnabled: false,
    exportEnabled: false,
    clickEvent: true,
    selectRow: false,
    selectCol: false,
    selectCell: false,
    rows: 50,
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

  accounts: Array<AccountBank>;
  isLoading: boolean = false;

  constructor(private accountService: AccountService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAccounts();
    _.forEach(this.columns, col => {
      if (col.key === 'deleteAccount')
        col['cellTemplate'] = this.deleteAccountTemplate;
        if (col.key === 'currency')
        col['cellTemplate'] = this.currencyTemplate;
    });
  }

  ngAfterViewChecked(){
    const data_labels = document.querySelectorAll("tbody tr td");
    Array.from(data_labels).forEach(x => {
      x.classList.remove("ng-star-inserted")
      x.classList.remove("no-results")
    })
  }

  filter(value: string) {
    this.table.apiEvent({
      type: API.onGlobalSearch, value: value,
    });
  }

  openDialogDeleteAccount(account: any): void {
    this.dialog.open(DialogConfirmDeleteAccountComponent, {
      maxWidth: '450px',
      panelClass: 'dialog-responsive',
      data: {account: account, parent: this}
    });
  }

  openDialogAddAccount(): void {
    const dialogRef = this.dialog.open(DialogAddAccountComponent, {
      maxWidth: '600px',
      panelClass: 'account-dialog-responsive'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") this.getAccounts();
    });
  }

  getAccounts() {
    this.isLoading = true;
    this.accounts = new Array<AccountBank>();
    this.accountService.getAccounts()
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe(
        (res: any) => {
          this.accounts = res;
        },
        error => {
          console.log(error);
          toaster.error(
            `Ha ocurrido un error al intentar eliminar la cuenta.`,
            'Error '
          );
        }
      );
  }

}
export interface DialogData {
  account: AccountBank;
  parent: AccountsComponent;
}
