import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransUpdatePage } from './trans-update.page';

const routes: Routes = [
  {
    path: '',
    component: TransUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransUpdatePageRoutingModule {}
