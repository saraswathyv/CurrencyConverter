import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CurrencyExchangeService } from 'src/app/services/currency-exchange.service';
import { MappedCurrencyRate } from 'src/app/shared/interfaces/currency-rate';

@Component({
  selector: 'app-exchange-rates-summary',
  templateUrl: './exchange-rates-summary.component.html',
  styleUrls: ['./exchange-rates-summary.component.scss'],
})
export class ExchangeRatesSummaryComponent implements OnInit {
  @Input() baseCurrency: string;
  @ViewChild('#searchInput') searchInput: HTMLInputElement;
  exchangeRateSubscription: Object;
  exchangeRateErrorSubscription: Object;

  constructor(private currencyExchangeService: CurrencyExchangeService) {}

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  exchangeRates: MappedCurrencyRate[] = [];
  dataSource: MatTableDataSource<MappedCurrencyRate>;
  displayedColumns = ['currency', 'rate'];

  ngOnInit(): void {
    this.setUpSubscriptions();
  }

  /**
   * Subscibe for the exchange rates table data
   */
  setUpSubscriptions():void {
    this.exchangeRateSubscription = this.currencyExchangeService.exchangeRates.subscribe(
      (data) => {
        if (data) {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.sort = this.sort;
        }
      }
    );
  }

  /**
   * Filter on search string
   * @param  {string} value
   */
  applySearchFilter(value: string):void {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  /**
   * Unsubscribe subscriptions
   */
  ngOnDestroy() {
    this.exchangeRateSubscription = null;
  }
}
