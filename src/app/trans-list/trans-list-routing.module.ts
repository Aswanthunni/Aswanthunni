import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransListPage } from './trans-list.page';

const routes: Routes = [
  {
    path: '',
    component: TransListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransListPageRoutingModule {}
