import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdditionalListPageRoutingModule } from './additional-list-routing.module';

import { AdditionalListPage } from './additional-list.page';
import { PopupAddPackagePageModule } from '../popup-add-package/popup-add-package.module';
import { BalanceSettlePopupPageModule } from '../balance-settle-popup/balance-settle-popup.module';
import { TransNewPageModule } from '../trans-new/trans-new.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdditionalListPageRoutingModule,
    PopupAddPackagePageModule,
    BalanceSettlePopupPageModule,
    TransNewPageModule
  ],
  declarations: [AdditionalListPage]
})
export class AdditionalListPageModule {}
