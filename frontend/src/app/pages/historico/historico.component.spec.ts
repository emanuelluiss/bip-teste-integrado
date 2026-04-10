import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HistoricoComponent } from './historico.component';
import { HistoricoModule } from './historico.module';
import { HistoricoService } from '../../shared/services/historico.service';
import { TransferenciaHistorico } from '../../shared/models/beneficio.model';
import { BehaviorSubject } from 'rxjs';
import { MessageService } from 'primeng/api';

const base = new Date('2024-06-01T10:00:00.000Z').toISOString();

const mockTransferencias: TransferenciaHistorico[] = [
  { id: '1', dataHora: base, fromId: 1, fromNome: 'Alimentação', toId: 2, toNome: 'Transporte', valor: 200, status: 'CONCLUIDA' },
  { id: '2', dataHora: base, fromId: 2, fromNome: 'Transporte',  toId: 1, toNome: 'Alimentação', valor: 50,  status: 'FALHOU', mensagemErro: 'Saldo insuficiente' },
  { id: '3', dataHora: base, fromId: 1, fromNome: 'Alimentação', toId: 3, toNome: 'Saúde',       valor: 100, status: 'CONCLUIDA' }
];

describe('HistoricoComponent', () => {
  let component: HistoricoComponent;
  let fixture: ComponentFixture<HistoricoComponent>;
  let historicoSubject: BehaviorSubject<TransferenciaHistorico[]>;
  let historicoSpy: jasmine.SpyObj<HistoricoService>;

  beforeEach(async () => {
    historicoSubject = new BehaviorSubject<TransferenciaHistorico[]>(mockTransferencias);
    historicoSpy = jasmine.createSpyObj('HistoricoService', ['limpar'], {
      historico$: historicoSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [HistoricoModule, RouterTestingModule],
      providers: [
        MessageService,
        { provide: HistoricoService, useValue: historicoSpy }
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent(HistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar todas as transferências no init', () => {
    expect(component.all.length).toBe(3);
    expect(component.filtered.length).toBe(3);
  });

  it('deve filtrar por status CONCLUIDA', () => {
    component.tipoFiltro = 'CONCLUIDA';
    component.aplicarFiltros();
    expect(component.filtered.length).toBe(2);
    expect(component.filtered.every(t => t.status === 'CONCLUIDA')).toBeTrue();
  });

  it('deve filtrar por status FALHOU', () => {
    component.tipoFiltro = 'FALHOU';
    component.aplicarFiltros();
    expect(component.filtered.length).toBe(1);
    expect(component.filtered[0].status).toBe('FALHOU');
  });

  it('deve filtrar por nome de origem via busca', () => {
    component.busca = 'transporte';
    component.aplicarFiltros();
    expect(component.filtered.length).toBe(2);
  });

  it('deve filtrar por nome de destino via busca', () => {
    component.busca = 'saúde';
    component.aplicarFiltros();
    expect(component.filtered.length).toBe(1);
  });

  it('deve limpar os filtros e restaurar lista completa', () => {
    component.busca = 'algo';
    component.tipoFiltro = 'FALHOU';
    component.limparFiltros();
    expect(component.busca).toBe('');
    expect(component.tipoFiltro).toBe('TODAS');
    expect(component.filtered.length).toBe(3);
  });

  it('deve alternar seleção de linha (toggle)', () => {
    const t = mockTransferencias[0];
    component.selecionarLinha(t);
    expect(component.selectedRow?.id).toBe('1');
    component.selecionarLinha(t);
    expect(component.selectedRow).toBeNull();
  });

  it('deve calcular totalEnviado apenas das CONCLUIDAS', () => {
    expect(component.totalEnviado).toBe(300);
  });

  it('deve calcular totalConcluidas', () => {
    expect(component.totalConcluidas).toBe(2);
  });

  it('deve calcular totalFalhou', () => {
    expect(component.totalFalhou).toBe(1);
  });

  it('deve chamar historico.limpar ao limparHistorico()', () => {
    component.limparHistorico();
    expect(historicoSpy.limpar).toHaveBeenCalled();
  });

  it('deve construir 4 itens de timeline ao selecionar linha', () => {
    component.selecionarLinha(mockTransferencias[0]);
    expect(component.timelineItems.length).toBe(4);
  });

  it('deve construir timeline com mensagem de erro para FALHOU', () => {
    component.selecionarLinha(mockTransferencias[1]);
    const itemFalhou = component.timelineItems[2];
    expect(itemFalhou.label).toContain('Saldo insuficiente');
  });
});
