import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForumListDetailsPageRoutingModule } from './forum-list-details-routing.module';

import { ForumListDetailsPage } from './forum-list-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForumListDetailsPageRoutingModule
  ],
  declarations: [ForumListDetailsPage]
})
export class ForumListDetailsPageModule {}
