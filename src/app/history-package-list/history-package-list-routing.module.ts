import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoryPackageListPage } from './history-package-list.page';

const routes: Routes = [
  {
    path: '',
    component: HistoryPackageListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoryPackageListPageRoutingModule {}
