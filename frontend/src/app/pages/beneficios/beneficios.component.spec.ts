import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BeneficiosComponent } from './beneficios.component';
import { BeneficiosModule } from './beneficios.module';
import { BeneficioService } from '../../shared/services/beneficio.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Beneficio } from '../../shared/models/beneficio.model';
import { of, throwError } from 'rxjs';

const mockBeneficios: Beneficio[] = [
  { id: 1, nome: 'Alimentação', descricao: 'Vale alimentação', valor: 800,  ativo: true,  version: 0 },
  { id: 2, nome: 'Transporte',  descricao: 'Vale transporte',  valor: 300,  ativo: false, version: 0 }
];

describe('BeneficiosComponent', () => {
  let component: BeneficiosComponent;
  let fixture: ComponentFixture<BeneficiosComponent>;
  let serviceSpy: jasmine.SpyObj<BeneficioService>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('BeneficioService', ['listar', 'criar', 'atualizar', 'deletar']);
    serviceSpy.listar.and.returnValue(of(mockBeneficios));

    await TestBed.configureTestingModule({
      imports: [BeneficiosModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        MessageService, ConfirmationService,
        { provide: BeneficioService, useValue: serviceSpy }
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent(BeneficiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar benefícios no init', () => {
    expect(component.beneficios.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('deve definir loading=false mesmo em caso de erro', () => {
    serviceSpy.listar.and.returnValue(throwError(() => new Error('Erro interno do servidor.')));
    component.load();
    expect(component.loading).toBeFalse();
  });

  it('deve abrir dialog para novo benefício com form zerado', () => {
    component.openNew();
    expect(component.dialogVisible).toBeTrue();
    expect(component.editingId).toBeNull();
    expect(component.form.get('ativo')!.value).toBeTrue();
  });

  it('deve abrir dialog para editar com dados do benefício', () => {
    component.openEdit(mockBeneficios[0]);
    expect(component.dialogVisible).toBeTrue();
    expect(component.editingId).toBe(1);
    expect(component.form.get('nome')!.value).toBe('Alimentação');
    expect(component.form.get('valor')!.value).toBe(800);
  });

  it('deve retornar dialogTitle correto para novo e editar', () => {
    component.editingId = null;
    expect(component.dialogTitle).toBe('Novo Benefício');
    component.editingId = 1;
    expect(component.dialogTitle).toBe('Editar Benefício');
  });

  it('deve não chamar service.criar quando form inválido', () => {
    component.form.reset();
    component.save();
    expect(serviceSpy.criar).not.toHaveBeenCalled();
  });

  it('deve chamar service.criar ao salvar novo benefício válido', () => {
    serviceSpy.criar.and.returnValue(of(mockBeneficios[0]));
    component.openNew();
    component.form.setValue({ nome: 'Novo', descricao: '', valor: 100, ativo: true });
    component.save();
    expect(serviceSpy.criar).toHaveBeenCalled();
  });

  it('deve chamar service.atualizar ao salvar benefício existente', () => {
    serviceSpy.atualizar.and.returnValue(of(mockBeneficios[0]));
    component.openEdit(mockBeneficios[0]);
    component.save();
    expect(serviceSpy.atualizar).toHaveBeenCalledWith(1, jasmine.any(Object));
  });

  it('deve chamar service.deletar ao confirmar exclusão', () => {
    serviceSpy.deletar.and.returnValue(of(void 0));
    component.delete(1);
    expect(serviceSpy.deletar).toHaveBeenCalledWith(1);
  });

  it('deve filtrar benefícios por nome', () => {
    const event = { target: { value: 'aliment' } } as unknown as Event;
    component.applyFilter(event);
    expect(component.filteredBeneficios.length).toBe(1);
    expect(component.filteredBeneficios[0].nome).toBe('Alimentação');
  });

  it('deve restaurar lista completa ao filtrar com string vazia', () => {
    const event = { target: { value: '' } } as unknown as Event;
    component.applyFilter(event);
    expect(component.filteredBeneficios.length).toBe(2);
  });

  it('deve acessar getters do form sem erro', () => {
    expect(component.nome).toBeTruthy();
    expect(component.descricao).toBeTruthy();
    expect(component.valor).toBeTruthy();
  });
});
