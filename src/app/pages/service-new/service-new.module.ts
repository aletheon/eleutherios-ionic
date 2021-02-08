import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceNewPageRoutingModule } from './service-new-routing.module';

import { ServiceNewPage } from './service-new.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiceNewPageRoutingModule
  ],
  declarations: [ServiceNewPage]
})
export class ServiceNewPageModule {}
