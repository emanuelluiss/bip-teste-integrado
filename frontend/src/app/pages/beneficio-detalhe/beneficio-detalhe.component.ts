import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TabsModule } from 'primeng/tabs';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { Beneficio, BeneficioRequest, TransferenciaHistorico } from '../../shared/models/beneficio.model';
import { BeneficioService } from '../../shared/services/beneficio.service';
import { HistoricoService } from '../../shared/services/historico.service';
import { BrlCurrencyPipe } from '../../shared/pipes/brl-currency.pipe';
import { MoneyDisplayComponent } from '../../shared/components/money-display/money-display.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-beneficio-detalhe',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    TabsModule, PanelModule, TagModule, ButtonModule, SkeletonModule,
    DividerModule, DialogModule, InputTextModule, InputNumberModule,
    CheckboxModule, ToastModule, TableModule, ChartModule,
    BrlCurrencyPipe, MoneyDisplayComponent, StatusBadgeComponent
  ],
  templateUrl: './beneficio-detalhe.component.html',
  styleUrls: ['./beneficio-detalhe.component.scss']
})
export class BeneficioDetalheComponent implements OnInit {
  beneficio: Beneficio | null = null;
  loading = true;
  dialogVisible = false;
  activeTab = '0';

  transferencias: TransferenciaHistorico[] = [];
  chartData: Record<string, unknown> = {};
  chartOptions: Record<string, unknown> = {};

  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private service: BeneficioService,
    private historico: HistoricoService,
    private fb: FormBuilder,
    private toast: MessageService
  ) {
    this.form = this.fb.group({
      nome:     ['', [Validators.required, Validators.maxLength(100)]],
      descricao:['', Validators.maxLength(255)],
      valor:    [null, [Validators.required, Validators.min(0.01)]],
      ativo:    [true]
    });
  }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.service.buscar(id).subscribe({
      next: data => { this.beneficio = data; this.loading = false; this.loadTransferencias(id); },
      error: () => { this.loading = false; this.router.navigate(['/beneficios']); }
    });
    this.buildChart();
  }

  loadTransferencias(id: number): void {
    this.historico.historico$.subscribe(hist => {
      this.transferencias = hist.filter(t => t.fromId === id || t.toId === id);
    });
  }

  buildChart(): void {
    const labels = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    });
    this.chartData = {
      labels,
      datasets: [
        { label: 'Entradas', data: labels.map(() => 0), borderColor: '#00E676', backgroundColor: 'rgba(0,230,118,0.1)', fill: true, tension: 0.4 },
        { label: 'Saídas',   data: labels.map(() => 0), borderColor: '#FF3D57', backgroundColor: 'rgba(255,61,87,0.1)',  fill: true, tension: 0.4 }
      ]
    };
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#7B8DB0' } } },
      scales: {
        x: { ticks: { color: '#7B8DB0' }, grid: { color: 'rgba(255,255,255,0.04)' } },
        y: { ticks: { color: '#7B8DB0' }, grid: { color: 'rgba(255,255,255,0.04)' } }
      }
    };
  }

  openEdit(): void {
    if (!this.beneficio) return;
    this.form.patchValue(this.beneficio);
    this.dialogVisible = true;
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const req: BeneficioRequest = this.form.value as BeneficioRequest;
    this.service.atualizar(this.beneficio!.id, req).subscribe({
      next: updated => {
        this.beneficio = updated;
        this.dialogVisible = false;
        this.toast.add({ severity: 'success', summary: 'Atualizado', detail: 'Benefício atualizado com sucesso.' });
      },
      error: (err: Error) => this.toast.add({ severity: 'error', summary: 'Erro', detail: err.message })
    });
  }

  irTransferencia(): void {
    this.router.navigate(['/transferencia'], { queryParams: { fromId: this.beneficio?.id } });
  }

  get initials(): string {
    return (this.beneficio?.nome ?? 'B').substring(0, 2).toUpperCase();
  }

  get nome()     { return this.form.get('nome')!; }
  get valor()    { return this.form.get('valor')!; }
}
