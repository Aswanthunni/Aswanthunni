import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopupAddPackagePageRoutingModule } from './popup-add-package-routing.module';

import { PopupAddPackagePage } from './popup-add-package.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopupAddPackagePageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [PopupAddPackagePage]
})
export class PopupAddPackagePageModule {}
