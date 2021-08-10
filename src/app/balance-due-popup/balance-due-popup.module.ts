import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BalanceDuePopupPageRoutingModule } from './balance-due-popup-routing.module';

import { BalanceDuePopupPage } from './balance-due-popup.page';
import { BalanceSettlePopupPageModule } from '../balance-settle-popup/balance-settle-popup.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BalanceDuePopupPageRoutingModule,
    BalanceSettlePopupPageModule
  ],
  declarations: [BalanceDuePopupPage]
})
export class BalanceDuePopupPageModule {}
