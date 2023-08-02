import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, ChangeDetectorRef, ComponentFactoryResolver } from '@angular/core';
import { API } from 'ngx-easy-table';
import { ConfigEasyTableService } from './clients-account-state.config';
import { Config } from 'protractor';
import { AccountBalance, EContactStatus, EBalance, EDepartment, EDelayStatus, EPublishDebt } from 'src/app/models/account-balance';
import { OverduePaymentDialogComponent } from '../overdue-payment-dialog/overdue-payment-dialog.component';
import { User } from 'src/app/models';
import { AccountBalanceService } from 'src/app/services/account-balance.service';
import { AuthGuard } from 'src/app/core/guards';
import { PrincipalService } from 'src/app/core/auth';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';
import * as moment from 'moment';
import { CommunicationComponent } from '../communication/communication.component';
import { toaster } from 'src/app/app.component';
import * as XLSX from 'xlsx';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-clients-account-state',
  templateUrl: './clients-account-state.component.html',
  styleUrls: ['./clients-account-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsAccountStateComponent implements OnInit {

  @ViewChild('table') table: any;
  @ViewChild('actions', { static: true }) actions: TemplateRef<any>;
  @ViewChild('departmentTemplate', { static: true }) departmentTemplate: TemplateRef<any>;
  @ViewChild('salesInvoiceAmountUSD', { static: true }) salesInvoiceAmountUSD: TemplateRef<any>;
  @ViewChild('paidPaymentsAmountUSD', { static: true }) paidPaymentsAmountUSD: TemplateRef<any>;
  @ViewChild('overduePaymentsAmountUSD', { static: true }) overduePaymentsAmountUSD: TemplateRef<any>;
  @ViewChild('publishDebtTemplate', { static: true }) publishDebtTemplate: TemplateRef<any>;

  isLoading: boolean = true;
  isExporting: boolean = false;
  columns: any;
  accountStatesDS: any = [];
  filteredAccountStatesDS: any = [];
  accountState: Array<AccountBalance> = [];
  configurationAccountsState: Config;
  eDepartment = EDepartment;
  ePublishDebt = EPublishDebt;
  eBalance = EBalance;
  eDelayStatus = EDelayStatus;
  searchValue = '';

  projects: string[] = ["Todos"];

  currentUser: User;

  filters = {
    project: "Todos",
    department: -1,
    balance: -1,
  };
  project$ = new BehaviorSubject(this.filters.project);
  department$ = new BehaviorSubject(this.filters.department);
  balance$ = new BehaviorSubject(this.filters.balance);

  public pagination = {
    limit: 10,
    offset: 0,
    count: -1,
  };

  constructor(
    private accountBalanceService: AccountBalanceService,
    public dialog: MatDialog,
    private authGuard: AuthGuard,
    private principalService: PrincipalService,
    private readonly cdr: ChangeDetectorRef

  ) {
    this.columns = ConfigEasyTableService.columns;
    this.configurationAccountsState = ConfigEasyTableService.configuration;
  }


  ngOnInit() {
    //Agrega dinamicamente los templates de las columnas a la tabla
    _.forEach(this.columns, col => {
      if (col.key === 'actions')
        col['cellTemplate'] = this.actions;
      if (col.key === 'departmentDesc')
        col['cellTemplate'] = this.departmentTemplate;
      if (col.key === 'salesInvoiceAmountUSD')
        col['cellTemplate'] = this.salesInvoiceAmountUSD;
      if (col.key === 'paidPaymentsAmountUSD')
        col['cellTemplate'] = this.paidPaymentsAmountUSD;
      if (col.key === 'overduePaymentsAmountUSD')
        col['cellTemplate'] = this.overduePaymentsAmountUSD;
      if (col.key === 'publishDebtDesc')
        col['cellTemplate'] = this.publishDebtTemplate;
    });

  }

  ngAfterViewInit(){
    this.accountBalanceService.getAllProjects().subscribe(p => {
      this.projects = this.projects.concat(p);
      this.principalService.getIdentity().subscribe((user) => {
        this.currentUser = user;
        this.initTable();
      })
    })
  }

  private initTable(){
      //@ts-ignore
      const user_bu = JSON.parse(this.currentUser.businessUnits).map(x => x.name);
      const projects = this.projects.filter(x => user_bu.includes(x.toLowerCase()))
      if (projects.length === 1){
        this.filters.project = projects[0];
      } else{
        this.filters.project = "Todos"
      }

      const roles = this.currentUser.userRoles.map(x => x.name).filter(x => x !== "cliente");
      const allowedRoles = ["cuentasacobrar","legales","externo"]
      if (roles.length === 1 && allowedRoles.includes(roles[0])){
            this.filters.department = allowedRoles.indexOf(roles[0]);
      } else {
        this.filters.department = -1
      }

      this.project$.next(this.filters.project);
      this.department$.next(this.filters.department);
      this.balance$.next(this.filters.balance);

      this.getData(this.generateParams({}));
  }

  private generateParams(obj: any, sendTo: string = ""){
    let params;
    if (sendTo === "forReport") {
      if (!this.IsNullOrUndefined(this.searchValue)) {
        params = 'search=' + this.searchValue;
      }
    } else{
      params = `limit=${this.pagination.limit}&page=${this.pagination.offset}${(obj.event == 'onGlobalSearch' || obj.event == 'onPagination') && this.searchValue ? '&search='+this.searchValue : ''}`; // see https://github.com/typicode/json-server
    }
    if (!this.IsNullOrUndefined(this.filters.project) && this.filters.project != 'Todos') {
      params = params + '&project=' + this.filters.project;
    }
    if (!this.IsNullOrUndefined(this.filters.department) && this.filters.department != -1) {
      params = params + '&department=' + this.filters.department;
    }
    if (!this.IsNullOrUndefined(this.filters.balance) && this.filters.balance != -1) {
      params = params + '&balance=' + this.filters.balance;
    }
    return params
  }

  private getData(params: string): void {
    //Agrega la info a tabla
    this.isLoading = true;
    this.configurationAccountsState.isLoading = true;
    this.accountBalanceService.getAll(params).subscribe(z => {
      this.accountState = z.accountBalances;
      this.pagination.count =
            this.pagination.count === -1 ?
              z ?
                z.totalCount
                : 0
              : z.totalCount;
      this.pagination = { ...this.pagination };

      this.accountStatesDS = this.mapAccountBalanceData(this.accountState);
      this.filteredAccountStatesDS = this.accountStatesDS;

      this.isLoading = false;
      this.configurationAccountsState.isLoading = false;

      this.cdr.detectChanges();
    },
      error => {
        this.isLoading = false;
        this.configurationAccountsState.isLoading = false;
      }
    );
  }

  eventEmitted($event: { event: string; value: any }): void {
    if ($event.event === 'onGlobalSearch' && $event.value.length >= 3) {
      this.parseEvent($event);
    } else if ($event.event !== 'onClick' && $event.event !== 'onDoubleClick' && $event.event !== 'onGlobalSearch') {
      this.parseEvent($event);
    }
  }

  search(searchValue) {
    const model = {
      event: 'onGlobalSearch',
      value: {
        page: this.searchValue != searchValue ? 1 : undefined
      }
    };

    this.searchValue = searchValue;
    this.parseEvent(model);
  }

  private parseEvent(obj: any): void {
    this.pagination.limit = obj.value.limit ? obj.value.limit : this.pagination.limit;
    this.pagination.offset = obj.value.page ? obj.value.page : this.pagination.offset;
    this.pagination = { ...this.pagination };

    this.getData(this.generateParams(obj));
  }

  public getAllForReport(): void {
    let params = this.generateParams({}, "forReport")
    this.isLoading = true;
    this.isExporting = true;

    this.accountBalanceService.getAllForReport(params).subscribe(result => {
      if (!!result) {
        const formatedAccountBalance = this.mapAccountBalanceData(result);
        this.exportToExcel(formatedAccountBalance);
        this.isLoading = false;
        this.isExporting = false;
      }
     }, error => {
        this.isLoading = false;
        this.isExporting = false;
     });
  }

  private mapAccountBalanceData(accountBalance: any[]): any[] {
    var data = accountBalance.map(x => {
      x['name'] = x.client?.firstName;
      x['cuit'] = x.clientCuit;
      //Convierte los string de los enum de CamelCase a Sentence Case
      x['contactStatusDesc'] = _.startCase(EContactStatus[x.contactStatus]);
      x['balanceDesc'] = _.startCase(EBalance[x.balance]);
      x['delayStatusDesc'] = _.startCase(EDelayStatus[x.delayStatus]);
      x['departmentDesc'] = _.startCase(EDepartment[x.department]);
      //Si es false se muestra el icono de editar, si es true el de editar
      x['isEditing'] = false;
      //Para que al editar por primera vez los select no aparezcan vacios
      x['departmentEdit'] = x.department;
      x['delayStatusEdit'] = x.delayStatus;
      //Determinar si puede editar una row dependiendo del departamento
      //Los departamentos deben llamarse igual que los roles
      x['canEdit'] = this.canEdit(x);
      x['canEditWorkStarted'] = !x['canEdit'] && this.authGuard.hasRoleWithName('ObrasParticulares');
      x['publishDebtEdit'] = x.publishDebt;
      if (x.publishDebt == null)
        x['publishDebtDesc'] = null;
      else
        x['publishDebtDesc'] = x.publishDebt == "Y" ? "Si" : "No"

      x['workStartedDesc'] = x.workStarted != null && x.workStarted == "Y" ? "Si" : "No"
      x['workStartedEdit'] = x.workStarted;

      x['project'] = this.getProject(x.businessUnit);
      x['client'] = { ...x.client, id: x.clientId }
      return x;
    });

    return data;
  }

  canEdit(row){
    return (this.authGuard.hasRoleWithName("admin") ||
            this.authGuard.hasRoleWithName(EDepartment[row.department]) ||
            EDepartment[row.department] === "Externo")
            && !this.authGuard.hasRoleWithName(EDepartment[EDepartment.Externo])
  }

  private IsNullOrUndefined(value): boolean {
    return value == null || value == undefined;
  }

  getProject(bu:string): string {
    let buSplit = bu?.split("-");
    return buSplit.length > 1 ? _.last(buSplit) : buSplit[0];
  }

  //Abre el dialog con el detalle de las cuotas vencidas
  showOverduePayments(row) {
    this.dialog.open(OverduePaymentDialogComponent, {
      data: {
        accountBalanceId: row.id,
        name: row.name,
        product: row.product
      },
      maxWidth: '90vw',
      autoFocus: false
    });
  }

  //Redirecciona a la página de comunicaciones
  showCommunications(row) {
    /*this.stateService.name = row.name
    this.stateService.product = row.product
    //En caso de que communications sea null o undefined hago que el stateService sea array vacio
    this.stateService.data = row.communications ? row.communications : [];
    this.stateService.id = row.id;
    this.stateService.client = row.client;
    this.stateService.canEdit = row.canEdit;*/
    //this.router.navigate(['/communications/']);
    this.dialog.open(CommunicationComponent, {
      data: {
        comms: row.communications ? row.communications : [],
        id: row.id,
        client: row.client,
        canEdit: row.canEdit,
        name: row.name,
        product: row.product,
        cuit: row.cuit
      },
      autoFocus: false,
      minHeight: 600,
      minWidth: '95%'
    });

  }

  edit(row) {
    row.isEditing = true;
  }

  editWorkStarted(row) {
    row.isEditingWorkStarted = true;
  }

  save(row: any) {
    row.isEditing = false;
    row.isEditingWorkStarted = false;
    this.isLoading = true;
    row.isSaving = true;
    // if(row.publishDebtEdit == "N"){
    //   row.departmentEdit = EDepartment.Externo;
    // }
    //service call loading icon?
    let accountBalance = {
      id: row.id,
      department: row.departmentEdit,
      delayStatus: row.delayStatusEdit,
      publishDebt: row.publishDebtEdit,
      workStarted: row.workStartedEdit
    }
    this.accountBalanceService.update(accountBalance).subscribe(result => {
      if (result) {
        this.isLoading = false;
        row.department = row.departmentEdit;
        row.delayStatus = row.delayStatusEdit;
        row.publishDebt = row.publishDebtEdit;
        row.workStarted = row.workStartedEdit;
        row.departmentDesc = _.startCase(EDepartment[row.department]);
        row.delayStatusDesc = _.startCase(EDelayStatus[row.delayStatus]);
        row.contactStatusDesc = _.startCase(EContactStatus[row.contactStatus]);
        row.publishDebtDesc = row.publishDebt == "Y" ? "Si" : "No"
        row.workStartedDesc = row.workStarted != null && row.workStarted == "Y" ? "Si" : "No"
        //Luego de editar el account balance hay que verificar que siga pertenciendo al mismo departamento
        row.canEdit = this.canEdit(row);
        row.canEditWorkStarted = !row.canEdit && this.authGuard.hasRoleWithName('ObrasParticulares');
        row.isSaving = false;
        row.newDataToSave = false;
      }
    }, error => {
      this.cancel(row);
      toaster.error(
        `Hubo un error al actualizar el balance de cuenta: ${error.message}`,
        'Error '
      );
      this.isLoading = false;
      row.isSaving = false;
      row.newDataToSave = false;
    })

  }

  cancel(row) {
    row.isEditing = false;
    row.newDataToSave = false;
    row.isEditingWorkStarted = false;
    //Limpio los valores, así la proxima vez que se edite, aparecen los valores reales
    row.departmentEdit = row.department;
    row.delayStatusEdit = row.delayStatus;
    row.publishDebtEdit = row.publishDebt;
    row.workStartedEdit = row.workStarted;
  }

  onChange(name: string): void {
    this.table.apiEvent({
      type: API.onGlobalSearch, value: name,
    });
  }

  resetPagination() {
   this.table.apiEvent({
      type: API.setPaginationCurrentPage,
      value: 1
    });
  }

  exportToExcel(data: any[]): void {
    //Here is simple example how to export to excel by https://www.npmjs.com/package/xlsx
    try {
      /* generate worksheet */
      //removes unnecesary fields
      let dataToExport = _.map(data, d => _.omit(d, ['client', 'communications',
        'totalDebtAmount', 'overduePaymentDate', 'canEdit', 'publishDebtEdit', 'publishDebtDesc', 'delayStatus',
        'department', 'contactStatus', 'balance', 'cuit', 'isEditing',
        'departmentEdit', 'delayStatusEdit']));
      //let headers = [];
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);

      //renaming headers
      ws.A1.v = 'ID';
      ws.B1.v = 'ID Cliente';
      ws.C1.v = 'Producto';
      ws.D1.v = 'Cuit Cliente';
      ws.E1.v = 'Cuotas a Vencer';
      ws.F1.v = 'A Vencer U$S';
      ws.G1.v = 'Cuotas Vencidas';
      ws.H1.v = 'Vencido U$S';
      ws.I1.v = 'Cuotas Pagadas';
      ws.J1.v = 'Monto Boleto U$S';
      ws.K1.v = 'Pagado U$S';
      ws.L1.v = 'Unidad Negocio';
      ws.M1.v = 'Nombre';
      ws.N1.v = 'Último contacto';
      ws.O1.v = 'Estado de cuenta';
      ws.P1.v = 'Estado de mora';
      ws.Q1.v = 'Departamento';

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wb, `Estado de Clientes al ${moment().format('DD-MM-YYYY HH:mm')}.xlsx`);
      this.isExporting = false;
    } catch (err) {
      toaster.error(`Ocurrió un error al exportar en Excel: ${err.message}`, 'Error ');
      this.isExporting = false;
    }
  }

  canSaveRow(row){
    row.newDataToSave = true;
  }

}

