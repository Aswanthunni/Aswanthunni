import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdmissionSettlePage } from './admission-settle.page';

const routes: Routes = [
  {
    path: '',
    component: AdmissionSettlePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdmissionSettlePageRoutingModule {}
