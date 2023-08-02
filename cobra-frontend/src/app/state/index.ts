import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as AppState from '../state/app.state';
import { ExchangeRateState } from './exchange-rate.reducer';

// Extends main state for LazyLoading
export interface State extends AppState.State {
    exchangeRate: ExchangeRateState;
}

// Selectors
const getExchangeRateFeatureState = createFeatureSelector<ExchangeRateState>('exchangeRate');

export const getUsdExchangeRate = createSelector(
    getExchangeRateFeatureState,
    state => state.tcUSD
);

export const getUVAExchangeRate = createSelector(
    getExchangeRateFeatureState,
    state => state.tcUVA
);

export const getCACExchangeRate = createSelector(
    getExchangeRateFeatureState,
    state => state.tcCAC
);

export const getError = createSelector(
    getExchangeRateFeatureState,
    state => state.error
);
