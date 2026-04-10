import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { Beneficio, BeneficioRequest } from '../../shared/models/beneficio.model';
import { BeneficioService } from '../../shared/services/beneficio.service';
import { BrlCurrencyPipe } from '../../shared/pipes/brl-currency.pipe';
import { MoneyDisplayComponent } from '../../shared/components/money-display/money-display.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-beneficios',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule,
    TableModule, DialogModule, ConfirmDialogModule, ToastModule, ToolbarModule,
    ButtonModule, InputTextModule, InputNumberModule, SelectModule, TagModule,
    SkeletonModule, TooltipModule, CheckboxModule,
    BrlCurrencyPipe, MoneyDisplayComponent, StatusBadgeComponent
  ],
  templateUrl: './beneficios.component.html',
  styleUrls: ['./beneficios.component.scss']
})
export class BeneficiosComponent implements OnInit {
  beneficios: Beneficio[] = [];
  filteredBeneficios: Beneficio[] = [];
  loading = true;
  dialogVisible = false;
  editingId: number | null = null;
  globalFilter = '';

  form: FormGroup;

  constructor(
    private service: BeneficioService,
    private fb: FormBuilder,
    private confirm: ConfirmationService,
    private toast: MessageService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nome:     ['', [Validators.required, Validators.maxLength(100)]],
      descricao:['', Validators.maxLength(255)],
      valor:    [null, [Validators.required, Validators.min(0.01)]],
      ativo:    [true]
    });
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.service.listar().subscribe({
      next: data => {
        this.beneficios = data;
        this.filteredBeneficios = data;
        this.loading = false;
      },
      error: (err: Error) => {
        this.toast.add({ severity: 'error', summary: 'Erro', detail: err.message });
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const term = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredBeneficios = this.beneficios.filter(b =>
      b.nome.toLowerCase().includes(term) ||
      (b.descricao ?? '').toLowerCase().includes(term)
    );
  }

  openNew(): void {
    this.editingId = null;
    this.form.reset({ ativo: true });
    this.dialogVisible = true;
  }

  openEdit(b: Beneficio): void {
    this.editingId = b.id;
    this.form.patchValue({ nome: b.nome, descricao: b.descricao, valor: b.valor, ativo: b.ativo });
    this.dialogVisible = true;
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const req: BeneficioRequest = this.form.value as BeneficioRequest;
    const isEdit = this.editingId !== null;
    const obs = isEdit ? this.service.atualizar(this.editingId!, req) : this.service.criar(req);

    obs.subscribe({
      next: () => {
        this.toast.add({ severity: 'success', summary: 'Sucesso', detail: isEdit ? 'Benefício atualizado.' : 'Benefício criado.' });
        this.dialogVisible = false;
        this.load();
      },
      error: (err: Error) => this.toast.add({ severity: 'error', summary: 'Erro', detail: err.message })
    });
  }

  confirmDelete(b: Beneficio): void {
    this.confirm.confirm({
      message: `Deseja excluir o benefício <strong>${b.nome}</strong>? Esta ação não pode ser desfeita.`,
      header: 'Confirmar exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.delete(b.id)
    });
  }

  delete(id: number): void {
    this.service.deletar(id).subscribe({
      next: () => {
        this.toast.add({ severity: 'success', summary: 'Excluído', detail: 'Benefício removido.' });
        this.load();
      },
      error: (err: Error) => this.toast.add({ severity: 'error', summary: 'Erro', detail: err.message })
    });
  }

  verDetalhe(id: number): void {
    this.router.navigate(['/beneficios', id]);
  }

  get dialogTitle(): string { return this.editingId ? 'Editar Benefício' : 'Novo Benefício'; }
  get nome()     { return this.form.get('nome')!; }
  get descricao(){ return this.form.get('descricao')!; }
  get valor()    { return this.form.get('valor')!; }
}
