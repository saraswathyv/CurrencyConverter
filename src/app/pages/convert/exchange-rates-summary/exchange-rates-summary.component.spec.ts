import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { CurrencyExchangeService } from 'src/app/services/currency-exchange.service';
import { ExchangeRates } from 'src/app/shared/interfaces/exchange-rates';
import { ExchangeRatesSummaryComponent } from './exchange-rates-summary.component';

describe('ExchangeRatesSummaryComponent', () => {
  let component: ExchangeRatesSummaryComponent;
  let fixture: ComponentFixture<ExchangeRatesSummaryComponent>;
  let testBedService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExchangeRatesSummaryComponent],
      imports: [HttpClientTestingModule],
      providers: [HttpClientModule],
    }).compileComponents();
    testBedService = TestBed.get(CurrencyExchangeService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeRatesSummaryComponent);
    component = fixture.componentInstance;
    testBedService.getLatestExchangeRates('USD', '2020-02-01');
    fixture.detectChanges();
  });

  it('Service injected via inject(...) and TestBed.get(...) should be the same instance', inject(
    [CurrencyExchangeService],
    (injectService: CurrencyExchangeService) => {
      expect(injectService).toBe(testBedService);
    }
  ));

  it('should apply filter', () => {
    component.dataSource = jasmine.createSpyObj('datasource', ['filter']);
    component.applySearchFilter('test')

    expect(component.dataSource.filter).toEqual('test');
  });
});
