import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: string;
}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: false
})
export class LayoutComponent implements OnInit {
  collapsed = false;
  currentRoute = '';

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard', badge: 'Em breve' },
    { label: 'Benefícios', icon: 'pi pi-wallet', route: '/beneficios' },
    { label: 'Transferências', icon: 'pi pi-arrow-right-arrow-left', route: '/transferencia' },
    { label: 'Histórico', icon: 'pi pi-history', route: '/historico' }
  ];

  breadcrumbMap: Record<string, string> = {
    '/beneficios': 'Benefícios',
    '/transferencia': 'Transferências',
    '/historico': 'Histórico de Transações',
    '/dashboard': 'Dashboard'
  };

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: NavigationEnd) => {
      this.currentRoute = e.urlAfterRedirects.split('?')[0];
    });
    this.currentRoute = this.router.url.split('?')[0];
    this.checkCollapse();
  }

  @HostListener('window:resize')
  checkCollapse(): void {
    this.collapsed = window.innerWidth < 1024;
  }

  get breadcrumb(): string {
    const base = '/' + this.currentRoute.split('/')[1];
    return this.breadcrumbMap[base] ?? 'FinanceApp';
  }

  get username(): string {
    return this.auth.currentUser?.username ?? 'Usuário';
  }

  get initials(): string {
    return this.username.substring(0, 2).toUpperCase();
  }

  isActive(route: string): boolean {
    return this.currentRoute.startsWith(route);
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
