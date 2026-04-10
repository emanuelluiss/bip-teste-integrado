import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';

import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'beneficios', pathMatch: 'full' },
      { path: 'beneficios', loadChildren: () => import('../pages/beneficios/beneficios.module').then(m => m.BeneficiosModule) },
      { path: 'transferencia', loadChildren: () => import('../pages/transferencia/transferencia.module').then(m => m.TransferenciaModule) },
      { path: 'historico', loadChildren: () => import('../pages/historico/historico.module').then(m => m.HistoricoModule) }
    ]
  }
];

@NgModule({
  declarations: [LayoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TooltipModule, BadgeModule, RippleModule, AvatarModule, ButtonModule
  ]
})
export class LayoutModule {}
