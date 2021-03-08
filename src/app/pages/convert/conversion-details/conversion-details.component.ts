import { Component, OnInit, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { CurrencyExchangeService } from 'src/app/services/currency-exchange.service';
import { ConversionRate } from 'src/app/shared/interfaces/conversation-rate';
import { MappedCurrencyRate } from 'src/app/shared/interfaces/currency-rate';

@Component({
  selector: 'app-conversion-details',
  templateUrl: './conversion-details.component.html',
  styleUrls: ['./conversion-details.component.scss']
})
export class ConversionDetailsComponent  {
  amount: number;
  result: string;
  fromCurrencyRate: MappedCurrencyRate;
  toCurrencyRate: MappedCurrencyRate;
  convertedResult: ConversionRate;
  fromCurrency: string;
  toCurrency: string;
  toRate: number;
  fromRate: number;
  errorMsg: string;

  constructor(public exchangeService: CurrencyExchangeService) { }

  ngOnInit() {
    this.exchangeService.converstionRate$.subscribe(data => {
      this.convertedResult = data;
      if (this.convertedResult) {
        this.fromCurrency = this.convertedResult.fromCurrencyRate && this.convertedResult.fromCurrencyRate.currency;
        this.fromRate = this.convertedResult.fromCurrencyRate && this.convertedResult.fromCurrencyRate.rate;
        this.toCurrency = this.convertedResult.toCurrencyRate && this.convertedResult.toCurrencyRate.currency;
        this.toRate = this.convertedResult.toCurrencyRate && this.convertedResult.toCurrencyRate.rate;
        this.amount = this.convertedResult.amount;
        this.result = this.convertedResult.result;
        this.errorMsg = this.convertedResult.errorMsg
      }
    })
  }
}
