import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdmissionTransPageRoutingModule } from './admission-trans-routing.module';

import { AdmissionTransPage } from './admission-trans.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdmissionTransPageRoutingModule
  ],
  declarations: [AdmissionTransPage]
})
export class AdmissionTransPageModule {}
