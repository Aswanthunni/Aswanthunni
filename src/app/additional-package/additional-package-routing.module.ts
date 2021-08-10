import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdditionalPackagePage } from './additional-package.page';

const routes: Routes = [
  {
    path: '',
    component: AdditionalPackagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdditionalPackagePageRoutingModule {}
