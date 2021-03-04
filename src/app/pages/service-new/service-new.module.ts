import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { MomentModule } from 'angular2-moment';

import { ServiceNewPageRoutingModule } from './service-new-routing.module';

import { ServiceNewPage } from './service-new.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiceNewPageRoutingModule,
    ReactiveFormsModule,
    MomentModule,
    IonicSelectableModule
  ],
  declarations: [ServiceNewPage]
})
export class ServiceNewPageModule {}
