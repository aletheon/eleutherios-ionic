import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { MomentModule } from 'angular2-moment';

import { ForumNewPageRoutingModule } from './forum-new-routing.module';

import { ForumNewPage } from './forum-new.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForumNewPageRoutingModule,
    ReactiveFormsModule,
    MomentModule,
    IonicSelectableModule
  ],
  declarations: [ForumNewPage]
})
export class ForumNewPageModule {}
