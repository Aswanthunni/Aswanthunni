import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdmissionTransPage } from './admission-trans.page';

const routes: Routes = [
  {
    path: '',
    component: AdmissionTransPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdmissionTransPageRoutingModule {}
