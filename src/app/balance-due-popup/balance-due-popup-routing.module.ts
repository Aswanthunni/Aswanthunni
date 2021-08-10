import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BalanceDuePopupPage } from './balance-due-popup.page';

const routes: Routes = [
  {
    path: '',
    component: BalanceDuePopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BalanceDuePopupPageRoutingModule {}
