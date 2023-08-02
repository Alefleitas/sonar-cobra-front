import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';
import { API, APIDefinition, Columns, Config, STYLE, THEME } from 'ngx-easy-table';
import { toaster } from 'src/app/app.component';
import { DebtFree } from 'src/app/models/debt-free';
import { SupportService } from 'src/app/services/support.service';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import { finalize } from 'rxjs';
import { PaymentService } from 'src/app/services/payment.service';
@Component({
  selector: 'app-debt-free',
  templateUrl: './debt-free.component.html',
  styleUrls: ['./debt-free.component.scss']
})
export class DebtFreeComponent implements OnInit {
  @ViewChild('tablaLibreDeuda') tablaLibreDeuda: APIDefinition;
  @ViewChild('enviarMailBtn') enviarMailBtn: TemplateRef<any>;
  @ViewChild('mailEnviado') mailEnviado: TemplateRef<any>;
  
  isLoading: boolean = true;
  clientesLibreDeuda: DebtFree[] = [];
  destinatario: DebtFree;

  columnasLibreDeuda: Columns[] = [
    { key: 'razonSocial', title: 'Razon Social', width: '25%'},
    { key: 'cuit', title: 'CUIT', width: '20%' },
    { key: 'producto', title: 'Producto', width: '20%'},
    { key: 'email', title: 'Mail', width: '25%'},
    { key: 'enviarMailBtn', title: 'Enviar Mail', width: '10%'}
  ];

  configuracionLibreDeuda: Config = {
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

  constructor(
    private paymentService: PaymentService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {    
  }
  
  ngAfterViewInit(){
    _.forEach(this.columnasLibreDeuda, col => {
      if (col.key === 'enviarMailBtn')
      col['cellTemplate'] = this.enviarMailBtn;
    });
    this.getClientes();
  }
  
  getClientes(){ 
    this.paymentService.getAllClientsOnDebtFree()
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe(res => {
        this.clientesLibreDeuda = res;
      },
      error => {
        toaster.error(
          'No se ha podido obtener la lista de clientes con libre deuda',
        );
      }
    );        
  }

  filter(value: string) {
    this.tablaLibreDeuda.apiEvent({
      type: API.onGlobalSearch, value: value,
    });
  }

  confirmDebtFreeEmail(payload: DebtFree){
    this.destinatario = payload;

    this.dialog.open(DialogInfoComponent, {
      maxWidth: "450px",
      panelClass: "dialog-responsive",
      data: {
        icon: "arrow_forward",
        text: `¿Confirmar envío de mail al siguiente cliente?<br /><br />${payload.razonSocial}<br /><br />${payload.email}`,
        negativeButton: "Cancelar",
        positiveButton: "Confirmar",
        componentAction: this,
      },
    });
  }
  
  actionNegative() {}

  actionPositive() {
    this.isLoading = true;
    this.paymentService.postFreeDebtEmail(this.destinatario)
    .pipe(
      finalize(() => this.isLoading = false)
    )
    .subscribe(res => {
        this.getClientes();
        toaster.success(
          `Se ha enviado correctamente el mail al cliente ${this.destinatario.razonSocial}`,
          'Éxito '
        );
      },
      error => {
        toaster.error(
          'No se ha podido enviar el mail al cliente ${this.destinatario.razonSocial}',
          'Error'
        );
      }
    );
  }
}
