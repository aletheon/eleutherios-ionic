import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForumEditPage } from './forum-edit.page';

const routes: Routes = [
  {
    path: '',
    component: ForumEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForumEditPageRoutingModule {}
