import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CurrencyExchangeService } from 'src/app/services/currency-exchange.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  baseCurrency: string = 'EUR';
  errorMsg: string = '';
  conversionRateSub: Subscription;
  fetchErrorSub: Subscription;

  constructor( private currencyExchangeService: CurrencyExchangeService,) { }

  ngOnInit(): void {
   this.conversionRateSub =   this.currencyExchangeService.converstionRate$.subscribe(
      data => {
        this.errorMsg = '';
        this.baseCurrency = data.fromCurrencyRate.currency;
      }
    )

    this.fetchErrorSub = this.currencyExchangeService.exchangeRatesFetchError.subscribe(
      err => {
        this.errorMsg = err;
      }
    )
  }
  
  /**
   * Unsubscibe subscriptions
   */
  ngOnDestroy() {
    this.conversionRateSub = null;
    this.fetchErrorSub = null;
  }
}
