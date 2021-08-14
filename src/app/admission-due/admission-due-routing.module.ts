import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdmissionDuePage } from './admission-due.page';

const routes: Routes = [
  {
    path: '',
    component: AdmissionDuePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdmissionDuePageRoutingModule {}
