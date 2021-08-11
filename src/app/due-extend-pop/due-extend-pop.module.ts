import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DueExtendPopPageRoutingModule } from './due-extend-pop-routing.module';

import { DueExtendPopPage } from './due-extend-pop.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DueExtendPopPageRoutingModule
  ],
  declarations: [DueExtendPopPage]
})
export class DueExtendPopPageModule {}
