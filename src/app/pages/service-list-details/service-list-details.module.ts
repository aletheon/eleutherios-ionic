import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceListDetailsPageRoutingModule } from './service-list-details-routing.module';

import { ServiceListDetailsPage } from './service-list-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiceListDetailsPageRoutingModule
  ],
  declarations: [ServiceListDetailsPage]
})
export class ServiceListDetailsPageModule {}
