import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DueExtendPageRoutingModule } from './due-extend-routing.module';

import { DueExtendPage } from './due-extend.page';
import { CommonFilterComponent } from '../common-filter/common-filter.component';
import { DueExtendPopPageModule } from '../due-extend-pop/due-extend-pop.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DueExtendPageRoutingModule,
    ReactiveFormsModule,
    DueExtendPopPageModule
  ],
  declarations: [DueExtendPage, CommonFilterComponent]
})
export class DueExtendPageModule {}
