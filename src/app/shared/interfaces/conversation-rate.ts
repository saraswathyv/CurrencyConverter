import { MappedCurrencyRate } from "./currency-rate";

export interface ConversionRate {
    fromCurrencyRate: MappedCurrencyRate;
    toCurrencyRate: MappedCurrencyRate;
    amount: number;
    result: string,
    errorMsg: string
}