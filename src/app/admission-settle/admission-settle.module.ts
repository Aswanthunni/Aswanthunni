import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdmissionSettlePageRoutingModule } from './admission-settle-routing.module';

import { AdmissionSettlePage } from './admission-settle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdmissionSettlePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AdmissionSettlePage]
})
export class AdmissionSettlePageModule {}
