import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopupAddPackagePage } from './popup-add-package.page';

const routes: Routes = [
  {
    path: '',
    component: PopupAddPackagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopupAddPackagePageRoutingModule {}
