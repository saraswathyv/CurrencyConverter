import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { CurrencyExchangeService } from './currency-exchange.service';
import { ExchangeRates } from '../shared/interfaces/exchange-rates';
import { MappedCurrencyRate } from '../shared/interfaces/currency-rate';
import { Observable, of } from 'rxjs';

describe('CurrencyExchangeService', () => {
  let apiEndpoint = 'https://api.ratesapi.io/api';
  let service: CurrencyExchangeService;
  let httpMock: HttpTestingController;
  let currencies = ['EUR', 'JPY', 'USD'];

  let response: ExchangeRates = {
    base: 'EUR',
    rates: {
      USD: 1.2,
      JPY: 128.58,
    },
  };

  let observableData: Observable<ExchangeRates> = of(response);
  let rates: MappedCurrencyRate[] = [
    { currency: 'USD', rate: 1.2 },
    { currency: 'JPY', rate: 128.58 },
    { currency: 'EUR', rate: 1 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CurrencyExchangeService],
    });
    service = TestBed.inject(CurrencyExchangeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('be able to retrieve exchange rates from the API via GET', () => {
    service.getLatestExchangeRates('USD', '2020-02-01').subscribe((data) => {
      expect(data).toEqual(response);
    });
    const request = httpMock.expectOne(
      `${apiEndpoint}/2020-02-01?base=USD&symbols=`
    );
    expect(request.request.method).toBe('GET');
    request.flush(response);
  });

  it('Should return the exchange rates', () => {
    const spyOnMethod = spyOn(service, 'getExchangeRates').and.callThrough();
    spyOn(service, 'getLatestExchangeRates').and.returnValue(observableData);
    service.getExchangeRates('USD');

    service.exchangeRates.subscribe((data) => {
      expect(data).toEqual(rates);
    });

    expect(spyOnMethod).toHaveBeenCalled();
  });

  it('Should get all currencies from given rates', () => {
    spyOn(service, 'mapCurrencies').withArgs(rates).and.callThrough();
    expect(service.mapCurrencies(rates)).toEqual(currencies);
  });

  it('Should map currency and rate from given data', () => {
    spyOn(service, 'mapExchangeRatesResponseData')
      .withArgs(response)
      .and.callThrough();
    expect(service.mapExchangeRatesResponseData(response)).toEqual(rates);
  });
});
