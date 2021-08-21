import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OverDuePageRoutingModule } from './over-due-routing.module';

import { OverDuePage } from './over-due.page';
import { CommonFilterComponent } from '../common-filter/common-filter.component';
import { ImagePreviewPageModule } from '../image-preview/image-preview.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OverDuePageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ImagePreviewPageModule
  ],
  declarations: [OverDuePage, CommonFilterComponent]
})
export class OverDuePageModule {}
