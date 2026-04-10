import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Beneficio } from '../../shared/models/beneficio.model';
import { BeneficioService } from '../../shared/services/beneficio.service';
import { HistoricoService } from '../../shared/services/historico.service';
import { TransferenciaHistorico } from '../../shared/models/beneficio.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
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
