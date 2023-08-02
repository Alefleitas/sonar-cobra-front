import { createAction, props } from '@ngrx/store';

export const loadUvaExchangeRateSuccess = createAction(
    '[ExchangeRate API] Load UVA ExchangeRate Success',
    props<{ rateValue: number }>()
);

export const loadUvaExchangeRateFailure = createAction(
    '[ExchangeRate API] Load UVA ExchangeRate Failure',
    props<{ error: string }>()
);

export const loadUsdExchangeRateSuccess = createAction(
    '[ExchangeRate API] Load USD ExchangeRate Success',
    props<{ rateValue: number }>()
);

export const loadUsdExchangeRateFailure = createAction(
    '[ExchangeRate API] Load USD ExchangeRate Failure',
    props<{ error: string }>()
);

export const loadCacExchangeRateSuccess = createAction(
    '[ExchangeRate API] Load CAC ExchangeRate Success',
    props<{ rateValue: number }>()
);

export const loadCacExchangeRateFailure = createAction(
    '[ExchangeRate API] Load CAC ExchangeRate Failure',
    props<{ error: string }>()
);
