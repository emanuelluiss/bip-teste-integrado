import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { StepperModule } from 'primeng/stepper';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';

import { SharedModule } from '../../shared/shared.module';
import { TransferenciaComponent } from './transferencia.component';

const routes: Routes = [{ path: '', component: TransferenciaComponent }];

@NgModule({
  declarations: [TransferenciaComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    StepperModule, SelectModule, InputNumberModule, ButtonModule,
    DividerModule, ToastModule, MessageModule, ProgressSpinnerModule, TagModule
  ]
})
export class TransferenciaModule {}
