import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoryCustomerListPage } from './history-customer-list.page';

const routes: Routes = [
  {
    path: '',
    component: HistoryCustomerListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoryCustomerListPageRoutingModule {}
