import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { CurrencyExchangeService } from 'src/app/services/currency-exchange.service';

import { ConvertCurrencyComponent } from './convert-currency.component';

describe('ConvertCurrencyComponent', () => {
  let component: ConvertCurrencyComponent;
  let fixture: ComponentFixture<ConvertCurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, MatAutocompleteModule],
      declarations: [ ConvertCurrencyComponent ],
      providers: [FormBuilder, CurrencyExchangeService]
    })
    .compileComponents();
    fixture = TestBed.createComponent(ConvertCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
