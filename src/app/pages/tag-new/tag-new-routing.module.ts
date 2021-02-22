import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TagNewPage } from './tag-new.page';

const routes: Routes = [
  {
    path: '',
    component: TagNewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TagNewPageRoutingModule {}
