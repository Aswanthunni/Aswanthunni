import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoryPackageListPageRoutingModule } from './history-package-list-routing.module';

import { HistoryPackageListPage } from './history-package-list.page';
import { HistoryPaymentListPage } from '../history-payment-list/history-payment-list.page';
import { HistoryPaymentListPageModule } from '../history-payment-list/history-payment-list.module';
import { CommonFilterComponent } from '../common-filter/common-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoryPackageListPageRoutingModule,
    HistoryPaymentListPageModule,
    ReactiveFormsModule
  ],
  declarations: [HistoryPackageListPage, CommonFilterComponent]
})
export class HistoryPackageListPageModule {}
