import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PackageManagerPage } from './package-manager.page';

const routes: Routes = [
  {
    path: '',
    component: PackageManagerPage,
    children : [{
      path: 'package-list',
      loadChildren: () => import('../package-list/package-list.module').then(m => m.PackageListPageModule),
      pathMatch: 'full'
    },{
      path: '',
      loadChildren: () => import('../package-list/package-list.module').then(m => m.PackageListPageModule),
      pathMatch: 'full'
    },{
      path: 'additional-list',
      loadChildren: () => import('../additional-list/additional-list.module').then(m => m.AdditionalListPageModule),
      pathMatch: 'full'
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PackageManagerPageRoutingModule {}
