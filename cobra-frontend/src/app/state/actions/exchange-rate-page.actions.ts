import { createAction, props } from '@ngrx/store';

export const setUsdExchangeRate = createAction(
    '[ExchangeRate Page] Set USD Exchange Rate',
    props<{ usdValue: number }>()
);

export const setUvaExchangeRate = createAction(
    '[ExchangeRate Page] Set UVA Exchange Rate',
    props<{ uvaValue: number }>()
);

export const setCacExchangeRate = createAction(
    '[ExchangeRate Page] Set CAC Exchange Rate',
    props<{ cacValue: number }>()
);

export const loadUvaExchangeRate = createAction(
    '[ExchangeRate Page] Load UVA Exchange Rate'
);

export const loadUsdExchangeRate = createAction(
    '[ExchangeRate Page] Load USD Exchange Rate'
);

export const loadCacExchangeRate = createAction(
    '[ExchangeRate Page] Load CAC Exchange Rate'
);
