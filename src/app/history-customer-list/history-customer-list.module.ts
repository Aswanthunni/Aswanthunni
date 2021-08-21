import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoryCustomerListPageRoutingModule } from './history-customer-list-routing.module';

import { HistoryCustomerListPage } from './history-customer-list.page';
import { ImagePreviewPageModule } from '../image-preview/image-preview.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoryCustomerListPageRoutingModule,
    ImagePreviewPageModule
  ],
  declarations: [HistoryCustomerListPage]
})
export class HistoryCustomerListPageModule {}
