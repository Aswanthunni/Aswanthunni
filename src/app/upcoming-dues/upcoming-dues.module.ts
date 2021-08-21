import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpcomingDuesPageRoutingModule } from './upcoming-dues-routing.module';

import { UpcomingDuesPage } from './upcoming-dues.page';
import { CommonFilterComponent } from '../common-filter/common-filter.component';
import { ImagePreviewPageModule } from '../image-preview/image-preview.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpcomingDuesPageRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ImagePreviewPageModule
  ],
  declarations: [UpcomingDuesPage, CommonFilterComponent]
})
export class UpcomingDuesPageModule {}
