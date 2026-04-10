import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

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

import { SharedModule } from '../../shared/shared.module';
import { BeneficiosComponent } from './beneficios.component';

const routes: Routes = [
  { path: '', component: BeneficiosComponent },
  { path: ':id', loadChildren: () => import('../beneficio-detalhe/beneficio-detalhe.module').then(m => m.BeneficioDetalheModule) }
];

@NgModule({
  declarations: [BeneficiosComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    TableModule, DialogModule, ConfirmDialogModule, ToastModule, ToolbarModule,
    ButtonModule, InputTextModule, InputNumberModule, SelectModule, TagModule,
    SkeletonModule, TooltipModule, CheckboxModule
  ]
})
export class BeneficiosModule {}
