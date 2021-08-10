import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransListPageRoutingModule } from './trans-list-routing.module';

import { TransListPage } from './trans-list.page';
import { CommonFilterComponent } from '../common-filter/common-filter.component';
import { TransUpdatePageModule } from '../trans-update/trans-update.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransListPageRoutingModule,
    ReactiveFormsModule,
    TransUpdatePageModule
  ],
  declarations: [TransListPage, CommonFilterComponent]
})
export class TransListPageModule {}
