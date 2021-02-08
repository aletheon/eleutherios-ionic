import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { UserGuard } from './guards/user.guard';
import { AutomaticLoginGuard } from './guards/automatic-login.guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate: [AutomaticLoginGuard]
  },
  {
    path: '',
    canActivate: [AngularFireAuthGuard, UserGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/menu/menu.module').then( m => m.MenuPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
