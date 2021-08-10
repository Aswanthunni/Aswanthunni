import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PackageManagerPageRoutingModule } from './package-manager-routing.module';

import { PackageManagerPage } from './package-manager.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PackageManagerPageRoutingModule
  ],
  declarations: [PackageManagerPage]
})
export class PackageManagerPageModule {}
