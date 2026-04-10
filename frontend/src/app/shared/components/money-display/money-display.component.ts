import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-money-display',
  standalone: false,
  template: `
    <span class="money-display mono" [class.positive]="value > 0" [class.negative]="value < 0" [class.show-sign]="showSign">
      {{ formatted }}
    </span>
  `,
  styles: [`
    .money-display {
      font-family: 'DM Mono', monospace;
      font-weight: 500;
      color: var(--text-primary);
      &.positive.show-sign { color: var(--success); }
      &.negative.show-sign { color: var(--error); }
    }
  `]
})
export class MoneyDisplayComponent {
  @Input() value: number = 0;
  @Input() showSign = false;
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';

  get formatted(): string {
    const abs = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.abs(this.value));
    if (this.showSign && this.value !== 0) return this.value > 0 ? `+${abs}` : `-${abs}`;
    return abs;
  }
}
