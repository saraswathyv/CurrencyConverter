import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MappedCurrencyRate } from '../../../shared/interfaces/currency-rate';
import { Currency } from '../../../shared/enums/currency';
import { FormNames } from '../../../shared/enums/form-names';
import { CurrencyExchangeService } from 'src/app/services/currency-exchange.service';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { ConversionRate } from 'src/app/shared/interfaces/conversation-rate';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-convert-currency',
  templateUrl: './convert-currency.component.html',
  styleUrls: ['./convert-currency.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})

export class ConvertCurrencyComponent implements OnInit {
  @Output() dataChange: EventEmitter<ConversionRate> = new EventEmitter<ConversionRate>();
  currencyConverterForm: FormGroup;
  filteredFromCurrencies: Observable<string[]>;
  filteredToCurrencies: Observable<string[]>;
  fromCurrencyRate: MappedCurrencyRate;
  toCurrencyRate: MappedCurrencyRate;
  selectedDate: string;
  exchangeRates;
  result: string;
  amount: number;
  isLoading = true;
  formNames = FormNames;
  today: string;
  errorMsg: string;
  exchangeRateSubscription: Object;
  exchangeRateErrorSubscription: Object;
  state: { fromCurrency: any; toCurrency: any; date: string };

  constructor(
    private formBuilder: FormBuilder,
    private currencyExchangeService: CurrencyExchangeService
  ) {}

  ngOnInit() {
    const baseCurrency = Currency.EUR;
    const quoteCurrency = Currency.USD;
    this.today = moment(new Date()).format('YYYY-MM-DD');
    this.setUpSubscriptions();
    this.buildForm('1', baseCurrency, quoteCurrency, this.today);
    this.currencyExchangeService.getExchangeRates(baseCurrency);
  }

  /**
   * Set Up Subscriptions for exchange rates. Set Filters and Convert rates automatically.
   */
  private setUpSubscriptions(): void {
    this.exchangeRateSubscription = this.currencyExchangeService.exchangeRates.subscribe(
      (data) => {
        if (data) {
          this.exchangeRates = data;
          this.setUpFilters();
          this.convert();
        }
      }
    );

    this.exchangeRateErrorSubscription = this.currencyExchangeService.exchangeRatesFetchError.subscribe(
      (err) => {
        this.errorMsg = err;
        this.result = null;
      }
    );
  }

  /**
   * Register Filter changes for From and To Currency fields.
   * It filters as user types.
   */
  private setUpFilters(): void {
    this.filteredFromCurrencies = this.getValueChanges(FormNames.FromCurrency);
    this.filteredToCurrencies = this.getValueChanges(FormNames.ToCurrency);
  }

  /**
   * Builds the formcontrols for Amount, Base currency, Quote Currency and date
   * @param  {string} amountVal
   * @param  {string} fromCurrencyVal
   * @param  {string} toCurrencyVal
   * @param  {string} dateVal
   */
  private buildForm(
    amountVal: string,
    fromCurrencyVal: string,
    toCurrencyVal: string,
    dateVal: string
  ): void {
    this.currencyConverterForm = this.formBuilder.group({
      amount: [amountVal, Validators.required],
      fromCurrency: [fromCurrencyVal, Validators.required],
      toCurrency: [toCurrencyVal, Validators.required],
      date: new FormControl(moment(new Date(dateVal)).format('YYYY-MM-DD')),
    });
  }

  /**
   * Gets value of given form control
   * @param  {string} formControlName
   */
  private getFormControlValue(formControlName: string): string {
    return this.currencyConverterForm.get(formControlName).value;
  }

  /**
   * Registers value changes and filter currencies as user types in
   * @param {string} formControlName
   */
  private getValueChanges(formControlName: string): Observable<string[]> {
    const arr = this.currencyExchangeService.toCurrencies;
    return this.currencyConverterForm.get(formControlName).valueChanges.pipe(
      startWith(''),
      map((value) => this.filterCurrencies(value, arr))
    );
  }

  /**
   * Returns filtered currencies list
   * @param  {string} value
   * @param  {string[]} arrayToFilter
   */
  private filterCurrencies(value: string, arrayToFilter: string[]): string[] {
    const filterValueLowercase = value.toLowerCase();

    return arrayToFilter.filter((option) =>
      option.toLowerCase().includes(filterValueLowercase)
    );
  }

  /**
   * On Swap update the currency exchange rate value
   */
  swapCurrencies(): void {
    const baseCurrencyCode = this.getFormControlValue(FormNames.FromCurrency);
    const selectedDate = this.getSelectedDate();
    this.buildForm(
      this.getFormControlValue(FormNames.Amount),
      this.getFormControlValue(FormNames.ToCurrency),
      baseCurrencyCode,
      selectedDate
    );

    this.currencyExchangeService.getExchangeRates(
      baseCurrencyCode,
      selectedDate
    );
  }

  /**
   * On Input change, get new exchange rates and calculate.
   */
  onInputChange(): void {
    this.currencyExchangeService.getNewExchangeRates(
      this.currencyConverterForm
    );
  }

  /**
   * Convert the currency
   */
  convert() {
    this.currencyExchangeService.convert(this.currencyConverterForm.value);
  }

  private getSelectedDate() {
    const value: any = this.getFormControlValue(FormNames.Date);
    if (typeof value === 'string') {
      return value;
    } else {
      return value.format('YYYY-MM-DD');
    }
  }
  
  /**
   * Unsubscribe subsriptions
   */
  ngOnDestroy() {
    this.exchangeRateSubscription = null;
    this.exchangeRateErrorSubscription = null;
  }
}