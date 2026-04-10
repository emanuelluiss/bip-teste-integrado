import { Component, OnInit } from '@angular/core';
import { TransferenciaHistorico } from '../../shared/models/beneficio.model';
import { HistoricoService } from '../../shared/services/historico.service';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.scss'],
  standalone: false
})
export class HistoricoComponent implements OnInit {
  all: TransferenciaHistorico[] = [];
  filtered: TransferenciaHistorico[] = [];

  busca = '';
  tipoFiltro: string = 'TODAS';
  selectedRow: TransferenciaHistorico | null = null;

  tipoOptions = [
    { label: 'Todas', value: 'TODAS' },
    { label: 'Concluídas', value: 'CONCLUIDA' },
    { label: 'Falhou', value: 'FALHOU' }
  ];

  timelineItems: Array<{ time: string; label: string; icon: string; color: string }> = [];

  constructor(private historico: HistoricoService) {}

  ngOnInit(): void {
    this.historico.historico$.subscribe(data => {
      this.all = data;
      this.aplicarFiltros();
    });
  }

  aplicarFiltros(): void {
    let result = [...this.all];

    if (this.tipoFiltro !== 'TODAS') {
      result = result.filter(t => t.status === this.tipoFiltro);
    }

    if (this.busca.trim()) {
      const term = this.busca.toLowerCase();
      result = result.filter(t =>
        t.fromNome.toLowerCase().includes(term) ||
        t.toNome.toLowerCase().includes(term)
      );
    }

    this.filtered = result;
  }

  limparFiltros(): void {
    this.busca = '';
    this.tipoFiltro = 'TODAS';
    this.aplicarFiltros();
  }

  selecionarLinha(t: TransferenciaHistorico): void {
    this.selectedRow = this.selectedRow?.id === t.id ? null : t;
    if (this.selectedRow) this.buildTimeline(t);
  }

  private buildTimeline(t: TransferenciaHistorico): void {
    const hora = new Date(t.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    this.timelineItems = [
      { time: hora, label: 'Transferência iniciada', icon: 'pi pi-play', color: '#7B8DB0' },
      { time: hora, label: `Débito em ${t.fromNome}`, icon: 'pi pi-minus-circle', color: '#FF3D57' },
      {
        time: hora,
        label: t.status === 'CONCLUIDA' ? `Crédito em ${t.toNome}` : `Falhou: ${t.mensagemErro ?? 'Erro desconhecido'}`,
        icon: t.status === 'CONCLUIDA' ? 'pi pi-plus-circle' : 'pi pi-times-circle',
        color: t.status === 'CONCLUIDA' ? '#00E676' : '#FF3D57'
      },
      { time: hora, label: t.status === 'CONCLUIDA' ? 'Concluída com sucesso' : 'Operação revertida', icon: 'pi pi-check-circle', color: t.status === 'CONCLUIDA' ? '#00E676' : '#FF3D57' }
    ];
  }

  exportCsv(): void {
    const headers = 'Data/Hora,Origem,Destino,Valor,Status';
    const rows = this.filtered.map(t =>
      `"${t.dataHora}","${t.fromNome}","${t.toNome}","${t.valor}","${t.status}"`
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'historico.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  limparHistorico(): void { this.historico.limpar(); }

  get totalEnviado(): number { return this.filtered.filter(t => t.status === 'CONCLUIDA').reduce((s, t) => s + t.valor, 0); }
  get totalConcluidas(): number { return this.filtered.filter(t => t.status === 'CONCLUIDA').length; }
  get totalFalhou(): number { return this.filtered.filter(t => t.status === 'FALHOU').length; }
}
