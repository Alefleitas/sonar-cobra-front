import { createReducer, on } from '@ngrx/store';
import { ExchangeRatePageActions, ExchangeRateApiActions } from './actions';

// State Definition
export interface ExchangeRateState {
    tcUVA: number;
    tcUSD: number;
    tcCAC: number;
    error: string;
}
// Initial Values
const initialState: ExchangeRateState = {
    tcUSD: 0,
    tcUVA: 0,
    tcCAC: 0,
    error: ''
};

// Reducer
export const exchangeRateReducer = createReducer<ExchangeRateState>(
    initialState,
    on(ExchangeRatePageActions.setUsdExchangeRate, (state, action): ExchangeRateState => {
        return {
            ...state,
            tcUSD: action.usdValue
        };
    }),
    on(ExchangeRatePageActions.setUvaExchangeRate, (state, action): ExchangeRateState => {
        return {
            ...state,
            tcUVA: action.uvaValue
        };
    }),
    on(ExchangeRatePageActions.setCacExchangeRate, (state, action): ExchangeRateState => {
        return {
            ...state,
            tcCAC: action.cacValue
        };
    }),
    on(ExchangeRateApiActions.loadUsdExchangeRateSuccess, (state, action): ExchangeRateState => {
        return {
            ...state,
            tcUSD: action.rateValue,
            error: ''
        };
    }),
    on(ExchangeRateApiActions.loadUsdExchangeRateFailure, (state, action): ExchangeRateState => {
        return {
            ...state,
            tcUSD: 0,
            error: action.error
        };
    }),
    on(ExchangeRateApiActions.loadUvaExchangeRateSuccess, (state, action): ExchangeRateState => {
        return {
            ...state,
            tcUVA: action.rateValue,
            error: ''
        };
    }),
    on(ExchangeRateApiActions.loadUvaExchangeRateFailure, (state, action): ExchangeRateState => {
        return {
            ...state,
            tcUVA: 0,
            error: action.error
        };
    }),
    on(ExchangeRateApiActions.loadCacExchangeRateSuccess, (state, action): ExchangeRateState => {
        return {
            ...state,
            tcCAC: action.rateValue,
            error: ''
        };
    }),
    on(ExchangeRateApiActions.loadCacExchangeRateFailure, (state, action): ExchangeRateState => {
        return {
            ...state,
            tcCAC: 0,
            error: action.error
        };
    })
);
