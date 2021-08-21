import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BalanceDuePageRoutingModule } from './balance-due-routing.module';

import { BalanceDuePage } from './balance-due.page';
import { BalanceDuePopupPageModule } from '../balance-due-popup/balance-due-popup.module';
import { ImagePreviewPageModule } from '../image-preview/image-preview.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BalanceDuePageRoutingModule,
    BalanceDuePopupPageModule,
    ImagePreviewPageModule
  ],
  declarations: [BalanceDuePage]
})
export class BalanceDuePageModule {}
