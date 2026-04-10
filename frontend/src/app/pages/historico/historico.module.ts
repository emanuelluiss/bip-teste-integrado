import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelModule } from 'primeng/panel';
import { TimelineModule } from 'primeng/timeline';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';

import { SharedModule } from '../../shared/shared.module';
import { HistoricoComponent } from './historico.component';

const routes: Routes = [{ path: '', component: HistoricoComponent }];

@NgModule({
  declarations: [HistoricoComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule,
    TableModule, ButtonModule, TagModule, SelectModule, DatePickerModule,
    ToolbarModule, PanelModule, TimelineModule, InputTextModule, ToastModule, DividerModule
  ]
})
export class HistoricoModule {}
