import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { apiEndpoint } from '../globalConsts';
import { ConversionRate } from '../shared/interfaces/conversation-rate';
import { MappedCurrencyRate } from '../shared/interfaces/currency-rate';
import { ExchangeRates } from '../shared/interfaces/exchange-rates';

@Injectable({
  providedIn: 'root',
})
export class CurrencyExchangeService {
  private readonly apiEndpoint = apiEndpoint;
  public exchangeRates: BehaviorSubject<MappedCurrencyRate[]> = new BehaviorSubject<MappedCurrencyRate[]>(null);
  public converstionRate$ = new Subject<ConversionRate>();
  public exchangeRatesFetchError: Subject<string> = new Subject<string>();
  public fromCurrencies: string[] = [];
  public toCurrencies: string[] = [];
  private _state: { fromCurrency: any; toCurrency: any; date: string };

  constructor(private readonly http: HttpClient) {
    this.exchangeRates.subscribe((data) => {
      if (data) {
        this.fromCurrencies = this.mapCurrencies(data);
        this.toCurrencies = this.mapCurrencies(data);
      }
    });
  }

  /**
   * Get latest exchange rates of given base currency, date and quote currency.
   * @param  {string} baseCurrency
   * @param  {} date?
   * @param  {} quoteCurrency=''
   */
  getLatestExchangeRates(
    baseCurrency: string,
    date?,
    quoteCurrency = ''
  ): Observable<ExchangeRates> {
    const selectedDate = date ? date : 'latest';

    return this.http.get<ExchangeRates>(
      `${this.apiEndpoint}/${selectedDate}?base=${baseCurrency}&symbols=${quoteCurrency}`
    );
  }

  /**
   * Gets exchange rate and transforms it rate and currency
   * @param  {string} baseCurrencyCode
   * @param  {} date?
   */
  getExchangeRates(baseCurrencyCode: string, date?): void {
    this.getLatestExchangeRates(baseCurrencyCode, date).subscribe(
      (exchangeRates: ExchangeRates): void => {
        this.exchangeRates.next(
          this.mapExchangeRatesResponseData(exchangeRates)
        );
      },
      (err): void => {
        this.exchangeRatesFetchError.next(err.error.error);
      }
    );
  }

  /**
   * Maps all currency fields from data return array of supported Currencies
   * @param  {MappedCurrencyRate[]} data
   */
  mapCurrencies(data: MappedCurrencyRate[]): string[] {
    return data
      .map((mappedCurrency: MappedCurrencyRate) => {
        return mappedCurrency.currency;
      })
      .sort();
  }

  /**
   * Formats the returned API data to currency and rate format.
   * @param  {ExchangeRates} responseData
   */
  mapExchangeRatesResponseData(
    responseData: ExchangeRates
  ): MappedCurrencyRate[] {
    const mappedRates = Object.keys(responseData.rates).map(
      (item: string): MappedCurrencyRate => {
        return {
          currency: item,
          rate: responseData.rates[item],
        };
      }
    );

    const baseRate = mappedRates.find(
      (cRate) => cRate.currency === responseData.base
    );
    if (!baseRate) {
      mappedRates.push({ currency: responseData.base, rate: 1 });
    }
    return mappedRates;
  }

  getNewExchangeRates(form) {
    const value = form.value;

    const currentState = {
      fromCurrency: value.fromCurrency,
      toCurrency: value.toCurrency,
      date: this.getSelectedDate(value.date),
    };

    if (this._isSearchParamsChanged(currentState)) {
      this.getExchangeRates(
        value.fromCurrency,
        this.getSelectedDate(value.date)
      );
      this._setState(currentState);
    } else {
      this.convert(value);
    }
  }

  convert(value) {
    if (value) {
      let result;
      let errorMsg;
      const fromCurrencyRate = this.filterSelectedValue(value.fromCurrency);
      const toCurrencyRate = this.filterSelectedValue(value.toCurrency);

      const amount = Math.floor(value.amount);

      if (fromCurrencyRate && toCurrencyRate) {
        result = this.calculateExchangeRate(
          amount,
          fromCurrencyRate && fromCurrencyRate.rate,
          toCurrencyRate && toCurrencyRate.rate
        );
        //rrorMsg = '';
      } else {
        errorMsg = 'Data not available';
        result = '';
      }

      this.converstionRate$.next({
        fromCurrencyRate: fromCurrencyRate,
        toCurrencyRate: toCurrencyRate,
        amount: amount,
        result: result,
        errorMsg: errorMsg,
      });
    }
  }

  private filterSelectedValue(currencyCode: string): MappedCurrencyRate {
    return this.exchangeRates.value.find((item: MappedCurrencyRate) => {
      return item.currency === currencyCode;
    });
  }

  private calculateExchangeRate(
    amount: number,
    fromRate: number,
    toRate: number
  ): string {
    return ((amount * toRate) / fromRate).toFixed(5);
  }

  private _isSearchParamsChanged(currentState) {
    return JSON.stringify(currentState) !== JSON.stringify(this._state);
  }

  private _setState(state) {
    this._state = { ...state };
  }

  getSelectedDate(value): string {
    if (typeof value === 'string') {
      return value;
    } else {
      return value.format('YYYY-MM-DD');
    }
  }
}
