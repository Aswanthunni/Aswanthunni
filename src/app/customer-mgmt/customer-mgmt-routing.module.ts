import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerMgmtPage } from './customer-mgmt.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerMgmtPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerMgmtPageRoutingModule {}
