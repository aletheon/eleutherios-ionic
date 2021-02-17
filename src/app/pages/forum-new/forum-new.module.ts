import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForumNewPageRoutingModule } from './forum-new-routing.module';

import { ForumNewPage } from './forum-new.page';
import { MomentModule } from 'angular2-moment';
import { LoadingSpinnerModule } from '../../components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForumNewPageRoutingModule,
    ReactiveFormsModule,
    MomentModule,
    LoadingSpinnerModule
  ],
  declarations: [ForumNewPage]
})
export class ForumNewPageModule {}
