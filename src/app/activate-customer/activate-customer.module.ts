import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivateCustomerPageRoutingModule } from './activate-customer-routing.module';

import { ActivateCustomerPage } from './activate-customer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivateCustomerPageRoutingModule
  ],
  declarations: [ActivateCustomerPage]
})
export class ActivateCustomerPageModule {}
