import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PackageListPageRoutingModule } from './package-list-routing.module';

import { PackageListPage } from './package-list.page';
import { PopupAddPackagePageModule } from '../popup-add-package/popup-add-package.module';
import { BalanceDuePopupPageModule } from '../balance-due-popup/balance-due-popup.module';
import { TransNewPageModule } from '../trans-new/trans-new.module';
import { BalanceSettlePopupPageModule } from '../balance-settle-popup/balance-settle-popup.module';
import { ImagePreviewPageModule } from '../image-preview/image-preview.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PackageListPageRoutingModule,
    PopupAddPackagePageModule,
    BalanceSettlePopupPageModule,
    TransNewPageModule,
    ImagePreviewPageModule
  ],
  declarations: [PackageListPage]
})
export class PackageListPageModule {}
