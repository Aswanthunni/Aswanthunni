import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DueExtendPage } from './due-extend.page';

const routes: Routes = [
  {
    path: '',
    component: DueExtendPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DueExtendPageRoutingModule {}
