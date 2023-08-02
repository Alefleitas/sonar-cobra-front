import { QuotationService } from './../services/quotation.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ExchangeRatePageActions, ExchangeRateApiActions } from './actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

// Create Service
@Injectable()
export class ExchangeRateEffects {

    constructor(private actions$: Actions,
                private quotationService: QuotationService) {}

    // Define Effect
    loadUsdExchangeRate$ = createEffect(() => {
        return this.actions$.pipe(
            // Filter Actions
            ofType(ExchangeRatePageActions.loadUsdExchangeRate),
            // Map
            mergeMap(() =>
                // Call to Service
                this.quotationService.getLastDetalleDeudaUSD().pipe(
                    // Return new action
                    map(rateValue =>
                        ExchangeRateApiActions.loadUsdExchangeRateSuccess({ rateValue })),
                    catchError(error =>
                        of(ExchangeRateApiActions.loadUsdExchangeRateFailure({ error })))
            ))
        );
    });

    loadUvaExchangeRate$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ExchangeRatePageActions.loadUvaExchangeRate),
            mergeMap(() =>
                this.quotationService.getCurrentQuotation('UVA').pipe(
                    map((rate: any) =>
                        ExchangeRateApiActions.loadUvaExchangeRateSuccess({ rateValue: rate.valor })),
                    catchError(error =>
                        of(ExchangeRateApiActions.loadUvaExchangeRateFailure({ error })))
            ))
        );
    });

    loadCacExchangeRate$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ExchangeRatePageActions.loadCacExchangeRate),
            mergeMap(() =>
                this.quotationService.getCurrentQuotation('CAC').pipe(
                    map((rate: any) =>
                        ExchangeRateApiActions.loadCacExchangeRateSuccess({ rateValue: rate.valor })),
                    catchError(error =>
                        of(ExchangeRateApiActions.loadCacExchangeRateFailure({ error })))
            ))
        );
    });
}
