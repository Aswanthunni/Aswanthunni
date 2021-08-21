import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdmissionDuePageRoutingModule } from './admission-due-routing.module';

import { AdmissionDuePage } from './admission-due.page';
import { AdmissionSettlePageModule } from '../admission-settle/admission-settle.module';
import { ImagePreviewPageModule } from '../image-preview/image-preview.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdmissionDuePageRoutingModule,
    AdmissionSettlePageModule,
    ImagePreviewPageModule
  ],
  declarations: [AdmissionDuePage]
})
export class AdmissionDuePageModule {}
