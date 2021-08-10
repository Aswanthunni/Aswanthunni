import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerMgmtPageRoutingModule } from './customer-mgmt-routing.module';

import { CustomerMgmtPage } from './customer-mgmt.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerMgmtPageRoutingModule
  ],
  declarations: [CustomerMgmtPage]
})
export class CustomerMgmtPageModule {}
