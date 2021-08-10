import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DuesPageRoutingModule } from './dues-routing.module';

import { DuesPage } from './dues.page';
import { CommonFilterComponent } from '../common-filter/common-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DuesPageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [DuesPage, CommonFilterComponent]
})
export class DuesPageModule {}
