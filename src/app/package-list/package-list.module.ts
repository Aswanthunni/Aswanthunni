import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PackageListPageRoutingModule } from './package-list-routing.module';

import { PackageListPage } from './package-list.page';
import { PopupAddPackagePageModule } from '../popup-add-package/popup-add-package.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PackageListPageRoutingModule,
    PopupAddPackagePageModule
  ],
  declarations: [PackageListPage]
})
export class PackageListPageModule {}
