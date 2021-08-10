import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoryPaymentListPageRoutingModule } from './history-payment-list-routing.module';

import { HistoryPaymentListPage } from './history-payment-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoryPaymentListPageRoutingModule
  ],
  declarations: [HistoryPaymentListPage]
})
export class HistoryPaymentListPageModule {}
