import { BrlCurrencyPipe } from './brl-currency.pipe';

describe('BrlCurrencyPipe', () => {
  let pipe: BrlCurrencyPipe;

  beforeEach(() => { pipe = new BrlCurrencyPipe(); });

  it('deve formatar valor positivo em BRL', () => {
    expect(pipe.transform(1000)).toBe('R$\u00a01.000,00');
  });

  it('deve retornar R$ 0,00 para null', () => {
    expect(pipe.transform(null)).toBe('R$ 0,00');
  });

  it('deve retornar R$ 0,00 para undefined', () => {
    expect(pipe.transform(undefined)).toBe('R$ 0,00');
  });

  it('deve formatar valor decimal corretamente', () => {
    expect(pipe.transform(1234.56)).toBe('R$\u00a01.234,56');
  });

  it('deve formatar valor negativo sem sinal por padrão (usa Math.abs)', () => {
    expect(pipe.transform(-500)).toBe('R$\u00a0500,00');
  });

  it('deve adicionar sinal positivo quando showSign=true e valor positivo', () => {
    const result = pipe.transform(500, true);
    expect(result.startsWith('+')).toBeTrue();
  });

  it('deve adicionar sinal negativo quando showSign=true e valor negativo', () => {
    const result = pipe.transform(-500, true);
    expect(result.startsWith('-')).toBeTrue();
  });

  it('não deve adicionar sinal quando showSign=true e valor zero', () => {
    const result = pipe.transform(0, true);
    expect(result.startsWith('+') || result.startsWith('-')).toBeFalse();
  });
});
