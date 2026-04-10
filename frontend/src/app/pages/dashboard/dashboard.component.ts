import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { Beneficio, TransferenciaHistorico } from '../../shared/models/beneficio.model';
import { BeneficioService } from '../../shared/services/beneficio.service';
import { HistoricoService } from '../../shared/services/historico.service';
import { BrlCurrencyPipe } from '../../shared/pipes/brl-currency.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonModule, SkeletonModule, TagModule, DividerModule, BrlCurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  beneficios: Beneficio[] = [];
  transferencias: TransferenciaHistorico[] = [];
  loading = true;
  filterAtivos = true;
  private subs = new Subscription();

  constructor(
    private service: BeneficioService,
    private historico: HistoricoService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.service.beneficios$.subscribe(data => {
        this.beneficios = data;
        if (data.length > 0) this.loading = false;
      })
    );
    this.service.listar().subscribe({ error: () => { this.loading = false; } });
    this.subs.add(this.historico.historico$.subscribe(data => { this.transferencias = data; }));
  }

  ngOnDestroy(): void { this.subs.unsubscribe(); }

  get totalValor(): number {
    return this.beneficios.reduce((s, b) => s + b.valor, 0);
  }

  get totalAtivos(): number {
    return this.beneficios.filter(b => b.ativo).length;
  }

  get totalInativos(): number {
    return this.beneficios.filter(b => !b.ativo).length;
  }

  get beneficiosFiltrados(): Beneficio[] {
    return this.beneficios.filter(b => b.ativo === this.filterAtivos);
  }

  get transferenciasRecentes(): TransferenciaHistorico[] {
    return this.transferencias.slice(0, 5);
  }
}
