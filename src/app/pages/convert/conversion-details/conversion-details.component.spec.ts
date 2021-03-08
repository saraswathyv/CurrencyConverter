import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrencyExchangeService } from 'src/app/services/currency-exchange.service';

import { ConversionDetailsComponent } from './conversion-details.component';

describe('ConversionDetailsComponent', () => {
  let component: ConversionDetailsComponent;
  let fixture: ComponentFixture<ConversionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [ ConversionDetailsComponent ],
      providers: [CurrencyExchangeService]
    })
    .compileComponents();
    fixture = TestBed.createComponent(ConversionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
