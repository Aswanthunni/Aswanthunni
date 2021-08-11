import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DueExtendPopPage } from './due-extend-pop.page';

const routes: Routes = [
  {
    path: '',
    component: DueExtendPopPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DueExtendPopPageRoutingModule {}
