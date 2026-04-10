import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'beneficios',
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/beneficios/beneficios.component').then(m => m.BeneficiosComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./pages/beneficio-detalhe/beneficio-detalhe.component').then(m => m.BeneficioDetalheComponent)
          }
        ]
      },
      {
        path: 'transferencia',
        loadComponent: () => import('./pages/transferencia/transferencia.component').then(m => m.TransferenciaComponent)
      },
      {
        path: 'historico',
        loadComponent: () => import('./pages/historico/historico.component').then(m => m.HistoricoComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
