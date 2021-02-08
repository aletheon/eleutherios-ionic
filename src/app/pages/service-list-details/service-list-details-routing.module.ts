import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiceListDetailsPage } from './service-list-details.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceListDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceListDetailsPageRoutingModule {}
