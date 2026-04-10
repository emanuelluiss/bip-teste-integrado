import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Beneficio, BeneficioRequest, TransferenciaRequest } from '../models/beneficio.model';
import { HistoricoService } from './historico.service';

@Injectable({ providedIn: 'root' })
export class BeneficioService {
  private readonly base = `${environment.apiUrl}/beneficios`;

  private _loading = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading.asObservable();

  private _beneficios = new BehaviorSubject<Beneficio[]>([]);
  readonly beneficios$ = this._beneficios.asObservable();

  constructor(private http: HttpClient, private historico: HistoricoService) {}

  listar(): Observable<Beneficio[]> {
    this._loading.next(true);
    return this.http.get<Beneficio[]>(this.base).pipe(
      tap(data => this._beneficios.next(data)),
      finalize(() => this._loading.next(false)),
      catchError(this.handleError)
    );
  }

  buscar(id: number): Observable<Beneficio> {
    return this.http.get<Beneficio>(`${this.base}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  criar(req: BeneficioRequest): Observable<Beneficio> {
    this._loading.next(true);
    return this.http.post<Beneficio>(this.base, req).pipe(
      tap(novo => this._beneficios.next([...this._beneficios.value, novo])),
      finalize(() => this._loading.next(false)),
      catchError(this.handleError)
    );
  }

  atualizar(id: number, req: BeneficioRequest): Observable<Beneficio> {
    this._loading.next(true);
    return this.http.put<Beneficio>(`${this.base}/${id}`, req).pipe(
      tap(atualizado => this._beneficios.next(
        this._beneficios.value.map(b => b.id === id ? atualizado : b)
      )),
      finalize(() => this._loading.next(false)),
      catchError(this.handleError)
    );
  }

  deletar(id: number): Observable<void> {
    this._loading.next(true);
    return this.http.delete<void>(`${this.base}/${id}`).pipe(
      tap(() => this._beneficios.next(this._beneficios.value.filter(b => b.id !== id))),
      finalize(() => this._loading.next(false)),
      catchError(this.handleError)
    );
  }

  transferir(req: TransferenciaRequest, fromNome: string, toNome: string): Observable<void> {
    this._loading.next(true);
    return this.http.post<void>(`${this.base}/transferencia`, req).pipe(
      tap(() => {
        this.historico.registrar({ ...req, fromNome, toNome, status: 'CONCLUIDA' });
        // Atualiza os saldos localmente para refletir a transferência imediatamente
        this._beneficios.next(
          this._beneficios.value.map(b => {
            if (b.id === req.fromId) return { ...b, valor: b.valor - req.valor };
            if (b.id === req.toId)   return { ...b, valor: b.valor + req.valor };
            return b;
          })
        );
      }),
      finalize(() => this._loading.next(false)),
      catchError((err: HttpErrorResponse) => {
        this.historico.registrar({ ...req, fromNome, toNome, status: 'FALHOU', mensagemErro: err.error?.message });
        return this.handleError(err);
      })
    );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    let message = 'Ocorreu um erro inesperado. Tente novamente.';
    if (err.status === 0) {
      message = 'Sem conexão com o servidor. Verifique se o backend está ativo.';
    } else if (err.error?.message) {
      message = err.error.message;
    } else if (err.status === 404) {
      message = 'Recurso não encontrado.';
    } else if (err.status === 422) {
      message = err.error?.message ?? 'Operação não permitida.';
    } else if (err.status >= 500) {
      message = 'Erro interno do servidor.';
    }
    return throwError(() => new Error(message));
  }
}
