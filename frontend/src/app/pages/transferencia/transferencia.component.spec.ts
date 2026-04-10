import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TransferenciaComponent } from './transferencia.component';
import { TransferenciaModule } from './transferencia.module';
import { MessageService } from 'primeng/api';
import { BeneficioService } from '../../shared/services/beneficio.service';
import { HistoricoService } from '../../shared/services/historico.service';
import { Beneficio } from '../../shared/models/beneficio.model';
import { of } from 'rxjs';

const mockBeneficios: Beneficio[] = [
  { id: 1, nome: 'A', descricao: '', valor: 1000, ativo: true, version: 0 },
  { id: 2, nome: 'B', descricao: '', valor: 500,  ativo: true, version: 0 }
];

describe('TransferenciaComponent — validação de saldo', () => {
  let component: TransferenciaComponent;
  let fixture: ComponentFixture<TransferenciaComponent>;
  let serviceSpy: jasmine.SpyObj<BeneficioService>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('BeneficioService', ['listar', 'transferir']);
    serviceSpy.listar.and.returnValue(of(mockBeneficios));

    await TestBed.configureTestingModule({
      imports: [TransferenciaModule, HttpClientTestingModule, RouterTestingModule, NoopAnimationsModule],
      providers: [
        MessageService,
        HistoricoService,
        { provide: BeneficioService, useValue: serviceSpy }
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent(TransferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir erro quando valor excede saldo disponível', () => {
    component.fromId = 1;
    component.valor  = 9999;
    expect(component.valorError).toBe('Valor excede o saldo disponível.');
  });

  it('deve não exibir erro quando valor é válido', () => {
    component.fromId = 1;
    component.valor  = 500;
    expect(component.valorError).toBe('');
  });

  it('deve impedir avanço para etapa 2 sem origem e destino selecionados', () => {
    component.fromId = null;
    component.toId   = null;
    expect(component.canGoStep2()).toBeFalse();
  });

  it('deve impedir avanço para etapa 3 com saldo insuficiente', () => {
    component.fromId = 1;
    component.toId   = 2;
    component.valor  = 99999;
    expect(component.canGoStep3()).toBeFalse();
  });

  it('deve preencher 50% do saldo ao clicar no atalho', () => {
    component.fromId = 1;
    component.setPercent(50);
    expect(component.valor).toBe(500);
  });
});
