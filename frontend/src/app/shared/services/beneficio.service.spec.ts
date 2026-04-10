import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BeneficioService } from './beneficio.service';
import { HistoricoService } from './historico.service';
import { Beneficio } from '../models/beneficio.model';
import { environment } from '../../../environments/environment';

const BASE = `${environment.apiUrl}/beneficios`;

const mockBeneficio: Beneficio = { id: 1, nome: 'Beneficio A', descricao: 'Desc', valor: 1000, ativo: true, version: 0 };

describe('BeneficioService', () => {
  let service: BeneficioService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BeneficioService, HistoricoService]
    });
    service = TestBed.inject(BeneficioService);
    http    = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('deve listar benefícios com sucesso', () => {
    service.listar().subscribe(data => {
      expect(data.length).toBe(1);
      expect(data[0].nome).toBe('Beneficio A');
    });
    http.expectOne(BASE).flush([mockBeneficio]);
  });

  it('deve emitir erro amigável em 404', () => {
    service.buscar(99).subscribe({
      error: (err: Error) => expect(err.message).toBe('Recurso não encontrado.')
    });
    http.expectOne(`${BASE}/99`).flush(null, { status: 404, statusText: 'Not Found' });
  });

  it('deve emitir erro de servidor em 500', () => {
    service.listar().subscribe({
      error: (err: Error) => expect(err.message).toBe('Erro interno do servidor.')
    });
    http.expectOne(BASE).flush({}, { status: 500, statusText: 'Internal Server Error' });
  });

  it('deve criar um benefício com sucesso', () => {
    const req = { nome: 'Novo', descricao: '', valor: 500, ativo: true };
    service.criar(req).subscribe(data => expect(data.nome).toBe('Beneficio A'));
    http.expectOne({ method: 'POST', url: BASE }).flush(mockBeneficio);
  });

  it('deve deletar um benefício com sucesso', () => {
    let called = false;
    service.deletar(1).subscribe(() => { called = true; });
    http.expectOne({ method: 'DELETE', url: `${BASE}/1` }).flush(null);
    expect(called).toBeTrue();
  });

  it('deve emitir erro 422 de saldo insuficiente como mensagem amigável', () => {
    service.transferir({ fromId: 1, toId: 2, valor: 99999 }, 'A', 'B').subscribe({
      error: (err: Error) => expect(err.message).toContain('Saldo insuficiente')
    });
    const req = http.expectOne(`${BASE}/transferencia`);
    req.flush({ message: 'Saldo insuficiente no benefício id=1' }, { status: 422, statusText: 'Unprocessable Entity' });
  });
});
