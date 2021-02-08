import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: 'menu',
    component: MenuPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'forum-new',
        loadChildren: () => import('../forum-new/forum-new.module').then( m => m.ForumNewPageModule)
      },
      {
        path: 'forum-list',
        loadChildren: () => import('../forum-list/forum-list.module').then( m => m.ForumListPageModule)
      },
      {
        path: 'forum-list/:id',
        loadChildren: () => import('../forum-list-details/forum-list-details.module').then( m => m.ForumListDetailsPageModule)
      },
      {
        path: 'service-new',
        loadChildren: () => import('../service-new/service-new.module').then( m => m.ServiceNewPageModule)
      },
      {
        path: 'service-list',
        loadChildren: () => import('../service-list/service-list.module').then( m => m.ServiceListPageModule)
      },
      {
        path: 'service-list/:id',
        loadChildren: () => import('../service-list-details/service-list-details.module').then( m => m.ServiceListDetailsPageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'menu/home',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
