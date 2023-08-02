import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { State, getUsdExchangeRate, getUVAExchangeRate, getCACExchangeRate, getError } from '../../state';
import { AppConfigService } from 'src/app/core/config/AppConfigService';

@Component({
  selector: 'app-quotations-table',
  templateUrl: './quotations-table.component.html',
  styleUrls: ['./quotations-table.component.scss']
})
export class QuotationsTableComponent implements OnInit {

  fecha: any;
  usdExchangeRate: Observable<number>;
  uvaExchangeRate: Observable<number>;
  cacExchangeRate: Observable<number>;
  errorMessage: Observable<string>;
  isLoading: boolean;

  cartelCotizacion: {mostrar: boolean, texto: string};

  constructor(
    private store: Store<State>,
    private appConfigService: AppConfigService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.fecha =  moment().format('DD/MM/YYYY');
    this.usdExchangeRate = this.store.select(getUsdExchangeRate);
    this.uvaExchangeRate = this.store.select(getUVAExchangeRate);
    this.cacExchangeRate = this.store.select(getCACExchangeRate);
    this.errorMessage = this.store.select(getError);
    console.log(this.uvaExchangeRate)
    this.isLoading = false;

    this.cartelCotizacion = this.appConfigService.getConfig().cartelCotizacion;
  }

}
