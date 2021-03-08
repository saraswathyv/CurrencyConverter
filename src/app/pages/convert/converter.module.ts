import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { ConversionDetailsComponent } from './conversion-details/conversion-details.component'
import { ConvertCurrencyComponent } from './convert-currency/convert-currency.component'
import { ExchangeRatesSummaryComponent } from './exchange-rates-summary/exchange-rates-summary.component'
import { HomeComponent } from './home/home.component';
import * as sharedComponents from '../../shared';
import { MaterialModule } from 'src/app/material.module'


@NgModule({
  declarations: [
    ...sharedComponents.components,
    ConversionDetailsComponent,
    ConvertCurrencyComponent,
    ExchangeRatesSummaryComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    MaterialModule
  ],
  exports: [
    ...sharedComponents.components,
    ConversionDetailsComponent,
    ConvertCurrencyComponent,
    ExchangeRatesSummaryComponent,
    HomeComponent,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: []
})
export class converterModule {}