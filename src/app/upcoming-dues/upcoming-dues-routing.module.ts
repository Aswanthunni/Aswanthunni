import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpcomingDuesPage } from './upcoming-dues.page';

const routes: Routes = [
  {
    path: '',
    component: UpcomingDuesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpcomingDuesPageRoutingModule {}
