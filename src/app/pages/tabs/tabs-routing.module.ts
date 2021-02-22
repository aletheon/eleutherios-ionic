import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: '', // for routes that end in tabs
        loadChildren: () => import('../home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'forums',
        loadChildren: () => import('../forum-list/forum-list.module').then( m => m.ForumListPageModule)
      },
      {
        path: 'services',
        loadChildren: () => import('../service-list/service-list.module').then( m => m.ServiceListPageModule)
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
      },
      {
        path: 'tag-new',
        loadChildren: () => import('../tag-new/tag-new.module').then( m => m.TagNewPageModule)
      },
      {
        path: 'tag-list',
        loadChildren: () => import('../tag-list/tag-list.module').then( m => m.TagListPageModule)
      },
      {
        path: 'block-list',
        loadChildren: () => import('../block-list/block-list.module').then( m => m.BlockListPageModule)
      },
      {
        path: 'payment-list',
        loadChildren: () => import('../payment-list/payment-list.module').then( m => m.PaymentListPageModule)
      },
      {
        path: 'receipt-list',
        loadChildren: () => import('../receipt-list/receipt-list.module').then( m => m.ReceiptListPageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
