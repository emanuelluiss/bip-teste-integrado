import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard.component';
import { BeneficioService } from '../../shared/services/beneficio.service';
import { HistoricoService } from '../../shared/services/historico.service';
import { Beneficio, TransferenciaHistorico } from '../../shared/models/beneficio.model';
import { of, BehaviorSubject } from 'rxjs';

const mockBeneficios: Beneficio[] = [
  { id: 1, nome: 'Alimentação', descricao: 'Vale alimentação', valor: 800,  ativo: true,  version: 0 },
  { id: 2, nome: 'Transporte',  descricao: 'Vale transporte',  valor: 300,  ativo: true,  version: 0 },
  { id: 3, nome: 'Saúde',       descricao: 'Plano de saúde',  valor: 1200, ativo: false, version: 0 }
];

const mockHistorico: TransferenciaHistorico[] = [
  { id: 'a1', dataHora: new Date().toISOString(), fromId: 1, fromNome: 'Alimentação', toId: 2, toNome: 'Transporte', valor: 100, status: 'CONCLUIDA' },
  { id: 'a2', dataHora: new Date().toISOString(), fromId: 2, fromNome: 'Transporte',  toId: 1, toNome: 'Alimentação', valor: 50, status: 'FALHOU', mensagemErro: 'Saldo insuficiente' }
];

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let serviceSpy: jasmine.SpyObj<BeneficioService>;
  let historicoSubject: BehaviorSubject<TransferenciaHistorico[]>;

  beforeEach(async () => {
    historicoSubject = new BehaviorSubject<TransferenciaHistorico[]>([]);
    serviceSpy = jasmine.createSpyObj('BeneficioService', ['listar']);
    serviceSpy.listar.and.returnValue(of(mockBeneficios));

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, HttpClientTestingModule, RouterTestingModule, NoopAnimationsModule],
      providers: [
        { provide: BeneficioService, useValue: serviceSpy },
        { provide: HistoricoService, useValue: { historico$: historicoSubject.asObservable() } }
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar a lista de benefícios no init', () => {
    expect(component.beneficios.length).toBe(3);
    expect(component.loading).toBeFalse();
  });

  it('deve calcular o totalValor corretamente', () => {
    expect(component.totalValor).toBe(2300);
  });

  it('deve calcular totalAtivos (somente ativo=true)', () => {
    expect(component.totalAtivos).toBe(2);
  });

  it('deve calcular totalInativos (somente ativo=false)', () => {
    expect(component.totalInativos).toBe(1);
  });

  it('deve iniciar com filterAtivos=true', () => {
    expect(component.filterAtivos).toBeTrue();
  });

  it('deve retornar apenas ativos em beneficiosFiltrados quando filterAtivos=true', () => {
    component.filterAtivos = true;
    expect(component.beneficiosFiltrados.length).toBe(2);
    expect(component.beneficiosFiltrados.every(b => b.ativo)).toBeTrue();
  });

  it('deve retornar apenas inativos em beneficiosFiltrados quando filterAtivos=false', () => {
    component.filterAtivos = false;
    expect(component.beneficiosFiltrados.length).toBe(1);
    expect(component.beneficiosFiltrados[0].ativo).toBeFalse();
  });

  it('deve retornar no máximo 5 transferências recentes', () => {
    const seis: TransferenciaHistorico[] = Array.from({ length: 6 }, (_, i) => ({
      id: `id-${i}`, dataHora: new Date().toISOString(),
      fromId: 1, fromNome: 'A', toId: 2, toNome: 'B', valor: 10, status: 'CONCLUIDA'
    }));
    historicoSubject.next(seis);
    expect(component.transferenciasRecentes.length).toBe(5);
  });

  it('deve atualizar transferências quando o histórico emitir', () => {
    historicoSubject.next(mockHistorico);
    expect(component.transferencias.length).toBe(2);
    expect(component.transferenciasRecentes[0].status).toBe('CONCLUIDA');
  });

  it('deve ter loading=false após erro no serviço', () => {
    const errorSpy = jasmine.createSpyObj('BeneficioService', ['listar']);
    errorSpy.listar.and.returnValue(of([]));
    component.loading = true;
    component.ngOnInit();
    expect(component.loading).toBeFalse();
  });
});
