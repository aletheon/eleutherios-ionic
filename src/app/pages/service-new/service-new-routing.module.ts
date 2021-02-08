import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiceNewPage } from './service-new.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceNewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceNewPageRoutingModule {}
