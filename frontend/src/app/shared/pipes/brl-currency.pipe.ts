import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'brlCurrency', standalone: true })
export class BrlCurrencyPipe implements PipeTransform {
  transform(value: number | null | undefined, showSign = false): string {
    if (value == null) return 'R$ 0,00';
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(value));
    if (showSign && value !== 0) {
      return value > 0 ? `+${formatted}` : `-${formatted}`;
    }
    return formatted;
  }
}
