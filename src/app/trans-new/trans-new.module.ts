import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransNewPageRoutingModule } from './trans-new-routing.module';

import { TransNewPage } from './trans-new.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransNewPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [TransNewPage]
})
export class TransNewPageModule {}
