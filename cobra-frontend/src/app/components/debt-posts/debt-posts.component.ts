import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { User, Payment } from 'src/app/models';
import { PropertyService } from 'src/app/services/property.service';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Property } from 'src/app/models/property';
import { PaymentService } from 'src/app/services/payment.service';
import { ConfigEasyTableService } from './debt-posts.config';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-debt-posts',
  templateUrl: './debt-posts.component.html',
  styleUrls: ['./debt-posts.component.scss']
})
export class DebtPostsComponent implements OnInit {
  @ViewChild('fechaPrimerVenc') fechaPrimerVenc: TemplateRef<any>;
  @ViewChild('importePrimerVenc') importePrimerVenc: TemplateRef<any>;
  moment: any = moment;
  currentUser: User;
  properties: any[];
  filteredProperties: any[] = [];
  productFilteredProperties: any[] = [];
  isLoading: boolean = true;
  cuits: string[] = [];
  cuit: string;
  filteredCuits: string[] = [];
  selectCuit: string;
  codigoMoneda: string;
  payments: any[] = [];
  paymentsDS: any[] = [];
  fechasFiltro: any[] = [];
  fechaFiltro: any;
  currency: string;
  product: any;

  columns: Columns[];
  configurationPayment: Config;

  constructor(
    private paymentService: PaymentService,
    private propertyService: PropertyService
  ) { }

  ngAfterViewInit() {
    _.forEach(this.columns, col => {
      if (col.key === 'fechaPrimerVenc')
        col['cellTemplate'] = this.fechaPrimerVenc;
      if (col.key === 'importePrimerVenc')
        col['cellTemplate'] = this.importePrimerVenc;
    });
  }

  ngOnInit() {
    this.configurationPayment = DefaultConfig;
    this.columns = ConfigEasyTableService.columns;
    this.propertyService.getPropertyCodesFull().subscribe(
      (res: any[]) => {
        this.properties = _.map(res, p => {
          let property = new Property();
          property.nroComprobante = p.nroComprobante;
          property.cuitCompany = p.cuitEmpresa;
          property.nroCuitCliente = p.nroCuitCliente;
          property.formatedFileName = p.formatedFileName;
          property.timeStamp = p.timeStamp;
          property.productCode = p.productCode;
          property.emprendimiento = p.emprendimiento;
          property.mixedEmpAndCode = `${p.emprendimiento} | ${p.productCode} | ${p.formatedFileName.includes('USD') ? 'USD' : 'ARS'}`;
          return property;
        });
        this.properties = _.sortBy(this.properties, prop => prop.mixedEmpAndCode);

        this.cuits = _.map(_.uniqBy(this.properties, p => p.nroCuitCliente), pr => pr.nroCuitCliente);
        this.filteredCuits = _.cloneDeep(this.cuits);

        this.isLoading = false;
      },
      error => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }

  filterPropertiesByCuit(cuit: string): void {
    this.filteredProperties = _.filter(_.cloneDeep(this.properties), p => p.nroCuitCliente === cuit);
    this.productFilteredProperties = _.orderBy(
      _.uniqBy(this.filteredProperties, p => p.mixedEmpAndCode + p.formatedFileName), ['mixedEmpAndCode'], ['asc']);

    this.paymentsDS = [];
    this.cuit = cuit;
    this.fechaFiltro = undefined;
    this.product = undefined;
  }

  filterPaymentsByFFileName(op: any): void {
    this.paymentsDS = [];
    this.fechaFiltro = undefined;

    const filteredByFileName = _.filter(_.cloneDeep(this.filteredProperties), p => p.mixedEmpAndCode == op.mixedEmpAndCode);

    this.fechasFiltro = _.compact(
      _.map(
        _.uniqBy(filteredByFileName, p => p.mixedEmpAndCode + p.timeStamp), pr => {
          let fec = pr.timeStamp.includes('.') ?
          moment(pr.timeStamp.substring(0, pr.timeStamp.indexOf('.')), 'YYYYMMDD hh:mm:ss')
            .format('DD/MM/YYYY hh:mm A') :
          moment(pr.timeStamp, 'MM/DD/YYYY hh:mm:ss')
            .format('DD/MM/YYYY hh:mm A');
          let fechaObj = {
            fec,
            timeStamp: pr.timeStamp
          };
          return fechaObj;
        }
      )
    );

    this.fechasFiltro = this.fechasFiltro.sort((a, b) => moment(b.fec, 'DD/MM/YYYY hh:mm A').diff(moment(a.fec, 'DD/MM/YYYY hh:mm A')));

    this.isLoading = true;

    this.paymentService.getPaymentsByFFileName(this.cuit, op.formatedFileName).subscribe((payments: Payment[]) => {
      this.payments = op.productCode ? _.filter(payments, (pay: Payment) => pay.obsLibreCuarta.trim() == op.productCode) : payments;
      this.isLoading = false;
    });
  }

  filterPaymentsByDate(fec: string): void {
    this.paymentsDS = _.filter(_.cloneDeep(this.payments), (pay: Payment) => pay.archivoDeuda.timeStamp === fec);
  }
}
