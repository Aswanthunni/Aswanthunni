import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddCustomerPageRoutingModule } from './add-customer-routing.module';
import { File } from '@ionic-native/file/ngx';
import { Camera } from '@ionic-native/Camera/ngx';
import { AddCustomerPage } from './add-customer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddCustomerPageRoutingModule,
    FormsModule, ReactiveFormsModule
  ],
  declarations: [AddCustomerPage]
})
export class AddCustomerPageModule {}
