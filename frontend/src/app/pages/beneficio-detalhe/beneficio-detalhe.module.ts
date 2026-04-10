import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

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

import { SharedModule } from '../../shared/shared.module';
import { BeneficioDetalheComponent } from './beneficio-detalhe.component';

const routes: Routes = [{ path: '', component: BeneficioDetalheComponent }];

@NgModule({
  declarations: [BeneficioDetalheComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    TabsModule, PanelModule, TagModule, ButtonModule, SkeletonModule,
    DividerModule, DialogModule, InputTextModule, InputNumberModule,
    CheckboxModule, ToastModule, TableModule, ChartModule
  ]
})
export class BeneficioDetalheModule {}
