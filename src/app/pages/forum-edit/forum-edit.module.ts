import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForumEditPageRoutingModule } from './forum-edit-routing.module';

import { ForumEditPage } from './forum-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForumEditPageRoutingModule
  ],
  declarations: [ForumEditPage]
})
export class ForumEditPageModule {}
