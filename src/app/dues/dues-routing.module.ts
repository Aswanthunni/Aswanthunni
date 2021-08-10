import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DuesPage } from './dues.page';

const routes: Routes = [
  {
    path: '',
    component: DuesPage,
    children : [{
      path: 'upcoming-dues',
      loadChildren: () => import('../upcoming-dues/upcoming-dues.module').then(m => m.UpcomingDuesPageModule),
      pathMatch: 'full'
    },{
      path: '',
      loadChildren: () => import('../upcoming-dues/upcoming-dues.module').then(m => m.UpcomingDuesPageModule),
      pathMatch: 'full'
    },{
      path: 'over-due',
      loadChildren: () => import('../over-due/over-due-routing.module').then(m => m.OverDuePageRoutingModule),
      pathMatch: 'full'
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DuesPageRoutingModule {}
