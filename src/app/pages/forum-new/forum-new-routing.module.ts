import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForumNewPage } from './forum-new.page';

const routes: Routes = [
  {
    path: '',
    component: ForumNewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForumNewPageRoutingModule {}
