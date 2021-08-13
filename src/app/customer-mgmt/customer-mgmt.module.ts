import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerMgmtPageRoutingModule } from './customer-mgmt-routing.module';

import { CustomerMgmtPage } from './customer-mgmt.page';
import { ImagePreviewPageModule } from '../image-preview/image-preview.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerMgmtPageRoutingModule,
    ImagePreviewPageModule
  ],
  declarations: [CustomerMgmtPage]
})
export class CustomerMgmtPageModule {}
