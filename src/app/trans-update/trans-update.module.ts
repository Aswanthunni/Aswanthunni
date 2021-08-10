import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransUpdatePageRoutingModule } from './trans-update-routing.module';

import { TransUpdatePage } from './trans-update.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransUpdatePageRoutingModule
  ],
  declarations: [TransUpdatePage]
})
export class TransUpdatePageModule {}
