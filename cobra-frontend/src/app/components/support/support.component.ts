import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Columns, Config, STYLE, THEME, APIDefinition, API } from 'ngx-easy-table';
import { SupportService } from 'src/app/services/support.service';
import { ClientSupport } from 'src/app/models/clientSupport';
import * as _ from 'lodash';
import { AuthService } from 'src/app/core/auth';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'
import { DialogRestrictClientComponent } from './dialog-restrict-client/dialog-restrict-client.component';
import { Console } from 'console';
import { UserRestrictions } from 'src/app/models/user-restrictions';
import { EPermission } from 'src/app/models/role';
@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {
  @ViewChild('loginAsClient', { static: true }) loginAsClient: TemplateRef<any>;
  @ViewChild('restringirCliente', { static: true }) restringirCliente: TemplateRef<any>;

  columns: Columns[] = [
    { key: 'id', title: 'Id' },
    { key: 'cuit', title: 'CUIT' },
    { key: 'razonSocial', title: 'Razon Social' },
    { key: 'restringirCliente', title: 'Restricciones', width: '80px' },
    { key: 'loginAsClient', title: 'Login', width: '80px' }
  ];

  configurationClients: Config = {
    searchEnabled: false,
    headerEnabled: true,
    orderEnabled: false,
    paginationEnabled: true,
    exportEnabled: false,
    clickEvent: true,
    selectRow: false,
    selectCol: false,
    selectCell: false,
    rows: 10,
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

  clientsDS: ClientSupport[];
  isLoading: boolean = false;

  @ViewChild('table', { static: true }) table: APIDefinition;

  constructor(
    private supportService: SupportService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.isLoading = true;
    _.forEach(this.columns, col => {
      if (col.key === 'loginAsClient')
        col['cellTemplate'] = this.loginAsClient;
      if (col.key === 'restringirCliente')
        col['cellTemplate'] = this.restringirCliente;
    });

    this.supportService.getAllClients().subscribe(x => {
      this.isLoading = false;
      this.clientsDS = x;
    });
  }

  filter(value: string) {
    this.table.apiEvent({
      type: API.onGlobalSearch, value: value,
    });
  }

  loginAs(clientId: string) {
    this.isLoading = true;
    this.supportService.loginAsClient(clientId).subscribe(x => {
      let sourceToken = this.authService.getToken();
      this.authService.storeAuthenticationSourceToken(sourceToken);
      this.authService.storeAuthenticationToken(x);
      this.authService.clearBuToken();
      this.isLoading = false;
      this.router.navigate(['/summary']);
      setTimeout(() => {
        window.location.reload();
      }, 100)  
    });
  }

  openRestrictDialog(userId: string, razonSocial: string): void {

    this.dialog.open(DialogRestrictClientComponent, {
      width: '500px',
      data: {userId, razonSocial }
    })
  }

}
