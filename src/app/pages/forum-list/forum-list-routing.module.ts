import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForumListPage } from './forum-list.page';

const routes: Routes = [
  {
    path: '',
    component: ForumListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForumListPageRoutingModule {}
