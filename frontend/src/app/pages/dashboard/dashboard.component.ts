import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { Beneficio, TransferenciaHistorico } from '../../shared/models/beneficio.model';
import { BeneficioService } from '../../shared/services/beneficio.service';
import { HistoricoService } from '../../shared/services/historico.service';
import { BrlCurrencyPipe } from '../../shared/pipes/brl-currency.pipe';
import { MoneyDisplayComponent } from '../../shared/components/money-display/money-display.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonModule, SkeletonModule, TagModule, DividerModule, BrlCurrencyPipe, MoneyDisplayComponent, StatusBadgeComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  beneficios: Beneficio[] = [];
  transferencias: TransferenciaHistorico[] = [];
  loading = true;

  constructor(
    private service: BeneficioService,
    private historico: HistoricoService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.service.listar().subscribe({
      next: data => { this.beneficios = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
    this.historico.historico$.subscribe(data => { this.transferencias = data; });
  }

  get totalValor(): number {
    return this.beneficios.reduce((s, b) => s + b.valor, 0);
  }

  get totalAtivos(): number {
    return this.beneficios.filter(b => b.ativo).length;
  }

  get totalInativos(): number {
    return this.beneficios.filter(b => !b.ativo).length;
  }

  get transferenciasRecentes(): TransferenciaHistorico[] {
    return this.transferencias.slice(0, 5);
  }
}
