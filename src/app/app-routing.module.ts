import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home/home',
    pathMatch: 'full'
  },
  {
    path: 'home/:id',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'add-customer',
    loadChildren: () => import('./add-customer/add-customer.module').then( m => m.AddCustomerPageModule)
  },
  {
    path: 'add-package',
    loadChildren: () => import('./add-package/add-package.module').then( m => m.AddPackagePageModule)
  },
  {
    path: 'additional-package',
    loadChildren: () => import('./additional-package/additional-package.module').then( m => m.AdditionalPackagePageModule)
  },
  {
    path: 'customer-mgmt',
    loadChildren: () => import('./customer-mgmt/customer-mgmt.module').then( m => m.CustomerMgmtPageModule)
  },
  {
    path: 'package-manager',
    loadChildren: () => import('./package-manager/package-manager.module').then( m => m.PackageManagerPageModule)
  },
  {
    path: 'package-list',
    loadChildren: () => import('./package-list/package-list.module').then( m => m.PackageListPageModule)
  },
  {
    path: 'additional-list',
    loadChildren: () => import('./additional-list/additional-list.module').then( m => m.AdditionalListPageModule)
  },
  {
    path: 'upcoming-dues',
    loadChildren: () => import('./upcoming-dues/upcoming-dues.module').then( m => m.UpcomingDuesPageModule)
  },
  {
    path: 'dues',
    loadChildren: () => import('./dues/dues.module').then( m => m.DuesPageModule)
  },
  {
    path: 'over-due',
    loadChildren: () => import('./over-due/over-due.module').then( m => m.OverDuePageModule)
  },
  {
    path: 'popup-add-package',
    loadChildren: () => import('./popup-add-package/popup-add-package.module').then( m => m.PopupAddPackagePageModule)
  },
  {
    path: 'history-customer-list/:id',
    loadChildren: () => import('./history-customer-list/history-customer-list.module').then( m => m.HistoryCustomerListPageModule)
  },
  {
    path: 'history-package-list',
    loadChildren: () => import('./history-package-list/history-package-list.module').then( m => m.HistoryPackageListPageModule)
  },
  {
    path: 'history-payment-list',
    loadChildren: () => import('./history-payment-list/history-payment-list.module').then( m => m.HistoryPaymentListPageModule)
  },
  {
    path: 'balance-due',
    loadChildren: () => import('./balance-due/balance-due.module').then( m => m.BalanceDuePageModule)
  },
  {
    path: 'balance-due-popup',
    loadChildren: () => import('./balance-due-popup/balance-due-popup.module').then( m => m.BalanceDuePopupPageModule)
  },
  {
    path: 'balance-settle-popup',
    loadChildren: () => import('./balance-settle-popup/balance-settle-popup.module').then( m => m.BalanceSettlePopupPageModule)
  },
  {
    path: 'trans-list',
    loadChildren: () => import('./trans-list/trans-list.module').then( m => m.TransListPageModule)
  },
  {
    path: 'trans-new',
    loadChildren: () => import('./trans-new/trans-new.module').then( m => m.TransNewPageModule)
  },
  {
    path: 'trans-update',
    loadChildren: () => import('./trans-update/trans-update.module').then( m => m.TransUpdatePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
