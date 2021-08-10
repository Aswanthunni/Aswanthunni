import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoryPaymentListPage } from './history-payment-list.page';

const routes: Routes = [
  {
    path: '',
    component: HistoryPaymentListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoryPaymentListPageRoutingModule {}
