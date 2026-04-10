import { Component, Input } from '@angular/core';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [TagModule],
  template: `
    <p-tag [severity]="severity" [value]="label"></p-tag>
  `
})
export class StatusBadgeComponent {
  @Input() ativo: boolean = true;

  get severity(): 'success' | 'danger' { return this.ativo ? 'success' : 'danger'; }
  get label(): string { return this.ativo ? 'Ativo' : 'Inativo'; }
}
