import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { toaster } from 'src/app/app.component';
import { Columns, Config, STYLE, THEME } from 'ngx-easy-table';
import { ConfigEasyTableService } from '../configuration-easy-table.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import * as _ from 'lodash';
import { amountConvertTool } from 'src/app/util/amountConvert.pipe';

@Component({
  selector: 'app-table-fee',
  templateUrl: './table-fee.component.html',
  styleUrls: ['./table-fee.component.scss'],
  providers: [ConfigEasyTableService]
})
export class TableFeeComponent implements OnInit {
  @ViewChild('tipoComprobanteTpl') tipoComprobanteTpl: TemplateRef<any>;
  @ViewChild('obsLibreSegundaTpl') obsLibreSegundaTpl: TemplateRef<any>;
  @ViewChild('fechaPrimerVencTpl', { static: true }) fechaPrimerVencTpl: TemplateRef<any>;

  @ViewChild('test') pru: TemplateRef<any>;

  @ViewChild('importePrimerVencTpl', { static: true }) importePrimerVencTpl: TemplateRef<any>;
  @ViewChild('payActionTpl', { static: true }) payActionTpl: TemplateRef<any>;
  @Input() product: any;
  @Input() data: any;
  dataOrg: any;
  @Input() header: any;
  @Input() total: number;
  @Output() eventData: EventEmitter<any>;
  @Output() eventBtnMod: EventEmitter<any>;
  formGroup: FormGroup;
  public columns: Columns[];
  configuration: any;
  checked: boolean;
  modify: boolean;
  disableCheckmodi: boolean;
  checkedAtLeastOnce: boolean = false;

  valorOrg: number;
  valorMod: number;
  valorInd: number;
  indx: number;

  openModify: boolean;

  partialIndex: number; //Guarda el indice actual de la row que se haya modificado para pagar parcial, sino hay, undefined

  paymentConfirm: boolean;

  constructor(private formBuilder: FormBuilder) {
    this.configuration = TableFeeComponent.config;
    this.eventData = new EventEmitter<any>();
    this.eventBtnMod = new EventEmitter<any>();
  }

  ngOnInit() {
    this.partialIndex = undefined;
    this.paymentConfirm = false;

    this.dataOrg = _.cloneDeep(this.data);

    this.data.forEach(element => {
      if (element.status === 'confirm' || element.status === 'accepted' || element.status === 'rejected') {
        this.paymentConfirm = true;
        this.product.disabled = true;
      }
      let paymentMethodTemp: any;
      let listPaymentMethodTemp: Array<any> = new Array<any>();
      if (!!element.paymentMethod) {
        // Obtenemos la lista de debts completa
        if (!this.buscarPayme(element.paymentMethod.debts, element)) {
          element.paymentMethod.debts.forEach(eleme => {
            paymentMethodTemp = { ...eleme };
            paymentMethodTemp.importePrimerVenc = +eleme.importePrimerVenc / 100;
            listPaymentMethodTemp.push(paymentMethodTemp);
          });
          paymentMethodTemp = { ...element };
          paymentMethodTemp.paymentMethod = null;
          listPaymentMethodTemp.push(paymentMethodTemp);
          listPaymentMethodTemp.sort((a, b) => { return a.id - b.id });
        }
        // Veryficamos la que el importe total a Pagar sea igual al Monto Pagado
        // Si no lo es bloquea la lista con  "this.paymentConfirm = true;"
        let subTotal: number = 0;
        listPaymentMethodTemp.forEach(ele => {
          if (+ele.codigoMoneda === element.paymentMethod.currency) {
            subTotal = (+subTotal.toFixed(2)) + (+ele.importePrimerVenc.toFixed(2));
          }
        });
        if (subTotal != element.paymentMethod.amount) {
          this.paymentConfirm = true;
        }
        // Se Recore la lista de debts para
        // ir Calculado el monto a Pagar de cada Uno
        let montoPagado = element.paymentMethod.amount;
        listPaymentMethodTemp.forEach(e => {
          if (element.paymentMethod.currency === +e.codigoMoneda) {
            montoPagado = montoPagado - e.importePrimerVenc;
          }
        });
        listPaymentMethodTemp.forEach(e => {
          if (element.fechaPrimerVenc == e.fechaPrimerVenc &&
            element.nroCuota === e.nroCuota) {
              element.pagado = amountConvertTool(element.paymentMethod.amount, element.paymentMethod.currency.toString(), true);
          }
        });
      }
    });

    this.indx = -1;
    this.formGroup = this.formBuilder.group({
      importePrimerVenc: ['', [Validators.required]]
    });

    this.columns = [
      // {
      //   key: 'tipoComprobante',
      //   title: 'Tipo',
      //   orderEnabled: true,
      //   cellTemplate: this.tipoComprobanteTpl,
      //   width: '10%'
      // },
      // {
      //   key: 'obsLibreSegunda',
      //   title: 'Nro transacción',
      //   orderEnabled: true,
      //   cellTemplate: this.obsLibreSegundaTpl,
      //   width: '30%'
      // },
      {
        key: 'fechaPrimerVenc',
        title: 'Fecha',
        orderEnabled: true,
        cellTemplate: this.fechaPrimerVencTpl,
        width: '20%',
        cssClass: { 'name': 'Fecha', 'includeHeader': false}
      },
      {
        key: 'importePrimerVenc',
        title: 'Importe',
        orderEnabled: true,
        cellTemplate: this.importePrimerVencTpl,
        width: '60%',
        cssClass: { 'name': 'Importe', 'includeHeader': false}
        
      },
      {
        key: 'payAction',
        title: 'Pagar',
        cellTemplate: this.payActionTpl,
        width: '20%',
        cssClass: { 'name': 'Pagar', 'includeHeader': false}
      }
    ];
    this.checked = false;
    this.modify = true;
  }


  public static config: Config = {
    searchEnabled: false,
    headerEnabled: true,
    orderEnabled: false,
    paginationEnabled: false,
    exportEnabled: false,
    clickEvent: true,
    selectRow: false,
    selectCol: false,
    selectCell: false,
    rows: 100,
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

  ngAfterViewChecked(){
    const data_labels = document.querySelectorAll("tbody tr td");
    Array.from(data_labels).forEach(x => {
      x.classList.remove("ng-star-inserted")
      x.classList.remove("no-results")
    })
  }

  // Se busca el pago en en la lista que se pasan por paramentros
  buscarPayme(list: any, pay: any): boolean {
    if(list) {
      list.forEach(element => {
        if (element.codigoMoneda === pay.codigoMoneda &&
          element.importePrimerVenc === pay.importePrimerVenc &&
          element.fechaPrimerVenc === pay.fechaPrimerVenc) {
          return true;
        }
      });
    }
    
    return false;
  }

  modifyBttn(index: any) {
    this.partialIndex = index;
    this.openModify = true;
    if (index != this.indx) {
      for (let idx = 0; idx < this.data.length; idx++) {
        this.data[idx].importePrimerVenc = this.dataOrg[idx].importePrimerVenc;
      }
    }
    this.indx = index;
    this.data[index].lastCheck = true;
    this.formGroup = this.formBuilder.group({
      importePrimerVenc: [
        this.data[index].importePrimerVenc,
        [
          Validators.required,
          Validators.min(0.01),
          Validators.max(this.dataOrg[index].importePrimerVenc)
        ]
      ]
    });
  }

  reloadValue(index: any) {

    let newImp = this.data[index].importePrimerVenc;
    let origImp = this.data[index].importePrimerVencOrig;

    this.data[index].importePrimerVenc = origImp;
    this.openModify = false;
    this.partialIndex = undefined;

    this.eventData.emit({ actualizeTotal: true })
  }

  saveModifiedPayment(formG: FormGroup, index: any, event: any) {

    console.log(event);

    let oldImp = this.data[index].importePrimerVenc;

    if(!formG.invalid){

      let newImp = formG.value.importePrimerVenc;
      this.data[index].importePrimerVenc = newImp;
      this.openModify = false;

    } else {
      event.target.value = oldImp;
      toaster.error(
        `El importe debe ser un valor entre 0,01 y ${oldImp}`,
        'Error '
        );
      }
      
    this.eventData.emit({ actualizeTotal: true })
  }

  changeValue(index: any, event: any) {
    this.checkedAtLeastOnce = true;

    if (!this.paymentConfirm) {
      // if (index > this.indx) {
      //   for (let idx = 0; idx < index; idx++) {
      //     this.data[idx].importePrimerVenc = this.dataOrg[idx].importePrimerVenc;
      //   }
      // }
      if (!this.modify || this.thereIsAPartialSelectedBefore(index)) return;
      //Si estoy tildando
      if (this.data[index].pay === false) {
        for (let i = index; i >= 0; i--) {
          if (this.data[i].canPay) this.data[i].pay = true; //se tildan todas las anteriores, que no estan ya en proceso o pagas
        }
      } //Si estoy destildando
      else {
        for (let i = index; i < this.data.length; i++) {
          if (this.data[i].pay === true) this.data[i].pay = false; //se tildan todas las posteriores
        }
      }

      //arregla bug de que al destildar todos no aparezca el boton de modificar
      if(this.data.every(x => !x.pay ))
        this.checkedAtLeastOnce = false;

      // this.enviarTotal();
      var cont = -1;
      var ult = -1;
      this.data.forEach(element => {
        element.lastCheck = false;
        cont++;
        if (element.pay) {
          ult = cont;
        }
      });
      if (ult != -1) {
        this.data[ult].lastCheck = true;
      }

      this.eventData.emit({ actualizeTotal: true })

      const cantPay = this.data.filter(x => !x.canPay).length;
      const selected = this.data.filter(x => x.pay).length;
      if (cantPay + selected === this.data.length) this.product.checked = true;
      else this.product.checked = false;
    }
    return false;
  }

  enviarTotal() {
    this.eventData.emit({ suma: this.getTotal() });
  }

  getTotal(): number {
    let total = 0;
    var cont = -1;
    var ult = -1;
    this.data.forEach(element => {
      element.lastCheck = false;
      cont++;
      if (element.pay) {
        total = total + element.importePrimerVenc;
        ult = cont;
      }
    });
    if (ult != -1) {
      this.data[ult].lastCheck = true;
    }
    return total;
  }

  calcAmount(deuda): string {
    let result;
    if (deuda.paymentMethod) {
      let arrDebts = [
        {
          codigoMoneda: deuda.codigoMoneda,
          importePrimerVenc: deuda.importePrimerVenc,
          fechaPrimerVenc: deuda.fechaPrimerVenc
        }
      ];
      //Agrega estos datos a una lista nueva para tener todas las debts
      // ya que desde la API, para evitar bucles redundantes, la debt seleccionada
      //no esta incluida dentro del paymentMethod (a pesar de que sabemos que si)
      deuda.debpaymentMethodin.debts.forEach(d => {
        //los importes de estas vienen en String. La actual ya esta modificada de antes, asique llevo los importes de estas a numero
        arrDebts.push({
          codigoMoneda: d.codigoMoneda,
          importePrimerVenc: Number(
            (Number(Number(d.importePrimerVenc).toFixed(2)) / 100).toFixed(2)
          ),
          fechaPrimerVenc: d.fechaPrimerVenc
        });
      });
      let arrDebtsSorted = arrDebts.sort(
        (d1, d2) =>
          this.fechaToNumber(d1.fechaPrimerVenc) -
          this.fechaToNumber(d2.fechaPrimerVenc)
      );
      let totalAmount = deuda.paymentMethod.amount;

      for (var aDebt of arrDebtsSorted) {
        if (Number(aDebt.codigoMoneda) === deuda.paymentMethod.currency) {
          let aDebtAmount = Number(Number(aDebt.importePrimerVenc).toFixed(2));
          if (
            this.fechaToNumber(aDebt.fechaPrimerVenc) ===
            this.fechaToNumber(deuda.fechaPrimerVenc)
          ) {
            if (totalAmount >= aDebtAmount) {
              result = aDebtAmount;
            } else {
              result = totalAmount;
              //this.modify = false; //cannot pay more debts because thisone is partial
            }
          }
          totalAmount = totalAmount - aDebtAmount;
        }
      }
      if (totalAmount >= 0) {
        this.modify = true; //Si totalAmount al final es 0, es porque se pago todo
      } else {
        this.modify = false;
      }
    } else result = 0.0;

    let signo;
    if (deuda.paymentMethod.currency === 0) signo = '$';
    else signo = 'us$';

    if (Number(result.toFixed(2)) === deuda.importePrimerVenc) return '';
    else return signo + result.toFixed(2);
  }


  formatFecha(fecha): string {
    // Si tiene 8 de length es porque no se formatio aun
    if (fecha.length === 8) {
      return moment(fecha).format(
        'DD/MM/YYYY'
      );
    } else return fecha;
  }


  fechaToNumber(fecha: string): number {
    if (fecha.length === 8) return Number(fecha);
    else {
      let parts = fecha.split('.');
      return Number(parts[2] + parts[1] + parts[0]);
    }
  }

  thereIsAPartialSelectedBefore(index) {
    if (this.partialIndex === undefined) return false;
    else return this.partialIndex < index;
  }


}
