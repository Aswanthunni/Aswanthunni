import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdditionalListPage } from './additional-list.page';

const routes: Routes = [
  {
    path: '',
    component: AdditionalListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdditionalListPageRoutingModule {}
