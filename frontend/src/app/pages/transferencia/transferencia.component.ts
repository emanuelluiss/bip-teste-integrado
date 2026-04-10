import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Beneficio } from '../../shared/models/beneficio.model';
import { BeneficioService } from '../../shared/services/beneficio.service';

@Component({
  selector: 'app-transferencia',
  templateUrl: './transferencia.component.html',
  styleUrls: ['./transferencia.component.scss'],
  standalone: false
})
export class TransferenciaComponent implements OnInit {
  step = 0;
  beneficios: Beneficio[] = [];
  loadingBeneficios = true;
  submitting = false;

  fromId: number | null = null;
  toId:   number | null = null;
  valor:  number | null = null;

  errorMessage = '';
  transferenciaConcluida = false;
  dataHoraTransferencia = '';

  constructor(
    private service: BeneficioService,
    private toast: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.service.listar().subscribe({
      next: data => {
        this.beneficios = data.filter(b => b.ativo);
        this.loadingBeneficios = false;
        const preSelected = this.route.snapshot.queryParamMap.get('fromId');
        if (preSelected) this.fromId = +preSelected;
      },
      error: () => { this.loadingBeneficios = false; }
    });
  }

  get destinos(): Beneficio[] {
    return this.beneficios.filter(b => b.id !== this.fromId);
  }

  get origem(): Beneficio | null {
    return this.beneficios.find(b => b.id === this.fromId) ?? null;
  }

  get destino(): Beneficio | null {
    return this.beneficios.find(b => b.id === this.toId) ?? null;
  }

  onFromChange(): void {
    if (this.toId === this.fromId) this.toId = null;
    this.valor = null;
    this.errorMessage = '';
  }

  setPercent(pct: number): void {
    if (!this.origem) return;
    this.valor = parseFloat((this.origem.valor * pct / 100).toFixed(2));
    this.validateValor();
  }

  validateValor(): string {
    if (!this.valor || this.valor <= 0) return 'Valor deve ser maior que zero.';
    if (this.origem && this.valor > this.origem.valor) return 'Valor excede o saldo disponível.';
    return '';
  }

  get valorError(): string { return this.validateValor(); }

  canGoStep2(): boolean { return !!this.fromId && !!this.toId; }
  canGoStep3(): boolean { return this.canGoStep2() && !!this.valor && !this.valorError; }

  goStep(n: number): void {
    if (n === 1 && !this.canGoStep2()) return;
    if (n === 2 && !this.canGoStep3()) return;
    this.step = n;
  }

  confirmar(): void {
    if (!this.canGoStep3() || !this.fromId || !this.toId || !this.valor) return;
    this.submitting = true;
    this.errorMessage = '';

    const fromNome = this.origem?.nome ?? '';
    const toNome   = this.destino?.nome ?? '';

    this.service.transferir({ fromId: this.fromId, toId: this.toId, valor: this.valor }, fromNome, toNome).subscribe({
      next: () => {
        this.dataHoraTransferencia = new Date().toLocaleString('pt-BR');
        this.transferenciaConcluida = true;
        this.submitting = false;
        this.toast.add({ severity: 'success', summary: 'Transferência realizada', detail: `R$ ${this.valor?.toFixed(2)} transferido com sucesso.` });
      },
      error: (err: Error) => {
        this.errorMessage = err.message;
        this.submitting = false;
      }
    });
  }

  reset(): void {
    this.step = 0;
    this.fromId = null;
    this.toId   = null;
    this.valor  = null;
    this.errorMessage = '';
    this.transferenciaConcluida = false;
  }
}
