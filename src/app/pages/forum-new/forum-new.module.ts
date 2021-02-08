import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForumNewPageRoutingModule } from './forum-new-routing.module';

import { ForumNewPage } from './forum-new.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForumNewPageRoutingModule
  ],
  declarations: [ForumNewPage]
})
export class ForumNewPageModule {}
