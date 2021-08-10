import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BalanceDuePage } from './balance-due.page';

const routes: Routes = [
  {
    path: '',
    component: BalanceDuePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BalanceDuePageRoutingModule {}
