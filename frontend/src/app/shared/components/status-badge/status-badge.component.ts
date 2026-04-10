import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: false,
  template: `
    <p-tag [severity]="severity" [value]="label"></p-tag>
  `
})
export class StatusBadgeComponent {
  @Input() ativo: boolean = true;

  get severity(): 'success' | 'danger' { return this.ativo ? 'success' : 'danger'; }
  get label(): string { return this.ativo ? 'Ativo' : 'Inativo'; }
}
