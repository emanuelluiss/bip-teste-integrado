import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { BrlCurrencyPipe } from './pipes/brl-currency.pipe';
import { MoneyDisplayComponent } from './components/money-display/money-display.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';

@NgModule({
  declarations: [
    BrlCurrencyPipe,
    MoneyDisplayComponent,
    StatusBadgeComponent
  ],
  imports: [CommonModule, TagModule],
  exports: [
    BrlCurrencyPipe,
    MoneyDisplayComponent,
    StatusBadgeComponent
  ]
})
export class SharedModule {}
