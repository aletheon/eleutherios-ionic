import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TagNewPageRoutingModule } from './tag-new-routing.module';

import { TagNewPage } from './tag-new.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TagNewPageRoutingModule
  ],
  declarations: [TagNewPage]
})
export class TagNewPageModule {}
