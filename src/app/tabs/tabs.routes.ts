import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AddComponent } from '../pages/add/add.component';
import { authGuard } from '../guards/auth-guard';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'favs ',
        loadComponent: () =>
          import('../pages/favs/favs.page').then((m) => m.FavsPage),
        canActivate: [authGuard],
        
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../pages/profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];
