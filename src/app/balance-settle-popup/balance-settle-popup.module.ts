import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BalanceSettlePopupPageRoutingModule } from './balance-settle-popup-routing.module';

import { BalanceSettlePopupPage } from './balance-settle-popup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BalanceSettlePopupPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [BalanceSettlePopupPage]
})
export class BalanceSettlePopupPageModule {}
