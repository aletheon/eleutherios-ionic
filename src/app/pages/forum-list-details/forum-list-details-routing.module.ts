import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForumListDetailsPage } from './forum-list-details.page';

const routes: Routes = [
  {
    path: '',
    component: ForumListDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForumListDetailsPageRoutingModule {}
