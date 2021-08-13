import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivateCustomerPage } from './activate-customer.page';

const routes: Routes = [
  {
    path: '',
    component: ActivateCustomerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivateCustomerPageRoutingModule {}
