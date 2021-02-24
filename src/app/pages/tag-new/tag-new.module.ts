import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TagNewPageRoutingModule } from './tag-new-routing.module';

import { TagNewPage } from './tag-new.page';
import { MomentModule } from 'angular2-moment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TagNewPageRoutingModule,
    ReactiveFormsModule,
    MomentModule
  ],
  declarations: [TagNewPage]
})
export class TagNewPageModule {}
