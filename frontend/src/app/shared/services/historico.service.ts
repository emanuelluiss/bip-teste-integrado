import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TransferenciaHistorico, TransferenciaRequest } from '../models/beneficio.model';

interface RegistrarParams extends TransferenciaRequest {
  fromNome: string;
  toNome: string;
  status: 'CONCLUIDA' | 'FALHOU';
  mensagemErro?: string;
}

@Injectable({ providedIn: 'root' })
export class HistoricoService {
  private readonly STORAGE_KEY = 'finance_historico';

  private _historico = new BehaviorSubject<TransferenciaHistorico[]>(this.load());
  readonly historico$: Observable<TransferenciaHistorico[]> = this._historico.asObservable();

  registrar(params: RegistrarParams): void {
    const entrada: TransferenciaHistorico = {
      id: crypto.randomUUID(),
      dataHora: new Date().toISOString(),
      fromId: params.fromId,
      fromNome: params.fromNome,
      toId: params.toId,
      toNome: params.toNome,
      valor: params.valor,
      status: params.status,
      mensagemErro: params.mensagemErro
    };
    const atual = [entrada, ...this._historico.value];
    this._historico.next(atual);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(atual));
  }

  limpar(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this._historico.next([]);
  }

  private load(): TransferenciaHistorico[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return [];
    try { return JSON.parse(raw) as TransferenciaHistorico[]; } catch { return []; }
  }
}
