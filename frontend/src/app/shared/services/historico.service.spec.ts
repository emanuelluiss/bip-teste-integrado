import { TestBed } from '@angular/core/testing';
import { HistoricoService } from './historico.service';

describe('HistoricoService', () => {
  let service: HistoricoService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [HistoricoService] });
    service = TestBed.inject(HistoricoService);
  });

  afterEach(() => localStorage.clear());

  it('deve iniciar com histórico vazio quando localStorage está limpo', (done) => {
    service.historico$.subscribe(data => {
      expect(data.length).toBe(0);
      done();
    });
  });

  it('deve registrar uma transferência concluída', (done) => {
    service.registrar({ fromId: 1, toId: 2, valor: 500, fromNome: 'A', toNome: 'B', status: 'CONCLUIDA' });

    service.historico$.subscribe(data => {
      expect(data.length).toBe(1);
      expect(data[0].status).toBe('CONCLUIDA');
      expect(data[0].valor).toBe(500);
      expect(data[0].fromNome).toBe('A');
      expect(data[0].toNome).toBe('B');
      done();
    });
  });

  it('deve registrar uma transferência com falha e mensagem de erro', (done) => {
    service.registrar({ fromId: 1, toId: 2, valor: 100, fromNome: 'A', toNome: 'B', status: 'FALHOU', mensagemErro: 'Saldo insuficiente' });

    service.historico$.subscribe(data => {
      expect(data[0].status).toBe('FALHOU');
      expect(data[0].mensagemErro).toBe('Saldo insuficiente');
      done();
    });
  });

  it('deve inserir novos registros no início da lista (ordem decrescente)', (done) => {
    service.registrar({ fromId: 1, toId: 2, valor: 100, fromNome: 'Primeiro', toNome: 'B', status: 'CONCLUIDA' });
    service.registrar({ fromId: 1, toId: 2, valor: 200, fromNome: 'Segundo', toNome: 'B', status: 'CONCLUIDA' });

    service.historico$.subscribe(data => {
      expect(data[0].fromNome).toBe('Segundo');
      expect(data[1].fromNome).toBe('Primeiro');
      done();
    });
  });

  it('deve persistir no localStorage após registrar', () => {
    service.registrar({ fromId: 1, toId: 2, valor: 300, fromNome: 'A', toNome: 'B', status: 'CONCLUIDA' });
    const raw = localStorage.getItem('finance_historico');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.length).toBe(1);
    expect(parsed[0].valor).toBe(300);
  });

  it('deve limpar o histórico e o localStorage', (done) => {
    service.registrar({ fromId: 1, toId: 2, valor: 100, fromNome: 'A', toNome: 'B', status: 'CONCLUIDA' });
    service.limpar();

    service.historico$.subscribe(data => {
      expect(data.length).toBe(0);
      expect(localStorage.getItem('finance_historico')).toBeNull();
      done();
    });
  });

  it('deve gerar IDs únicos para cada entrada', () => {
    service.registrar({ fromId: 1, toId: 2, valor: 100, fromNome: 'A', toNome: 'B', status: 'CONCLUIDA' });
    service.registrar({ fromId: 1, toId: 2, valor: 200, fromNome: 'A', toNome: 'B', status: 'CONCLUIDA' });
    const data = service['_historico'].value;
    expect(data[0].id).not.toBe(data[1].id);
  });
});
