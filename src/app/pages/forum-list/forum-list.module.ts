import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForumListPageRoutingModule } from './forum-list-routing.module';

import { ForumListPage } from './forum-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForumListPageRoutingModule
  ],
  declarations: [ForumListPage]
})
export class ForumListPageModule {}
