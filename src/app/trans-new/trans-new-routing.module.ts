import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransNewPage } from './trans-new.page';

const routes: Routes = [
  {
    path: '',
    component: TransNewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransNewPageRoutingModule {}
