import { Routes } from '@angular/router';
import { ShellLayoutComponentComponent } from './shared/shell-layout-component/shell-layout-component.component';
import { AddComponent } from './pages/add/add.component';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },

  {
    path: '',
    component: ShellLayoutComponentComponent,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'favs',
        loadComponent: () =>
          import('./pages/favs/favs.page').then((m) => m.FavsPage),
        canActivate: [authGuard],
      },
      {
        path: 'publish',
        loadComponent: () =>
          import('./pages/publish/publish.page').then((m) => m.PublishPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile.page').then((m) => m.ProfilePage),
      },

      {
        path: 'list-filter/:type/:neighborhood',
        loadComponent: () =>
          import('./pages/list-zone/list-zone.component').then(
            (m) => m.ListZoneComponent
          ),
      },
      {
        path: 'list-filter/:type',
        loadComponent: () =>
          import('./pages/list-zone/list-zone.component').then(
            (m) => m.ListZoneComponent
          ),
      },
      {
        path: 'list-zone/:id',
        loadComponent: () =>
          import('./pages/list-zone/list-zone.component').then(
            (m) => m.ListZoneComponent
          ),
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./pages/list-zone/list-zone.component').then(
            (m) => m.ListZoneComponent
          ),
      },
      {
        path: 'list-all',
        loadComponent: () =>
          import('./pages/list-zone/list-zone.component').then(
            (m) => m.ListZoneComponent
          ),
      },

      {
        path: 'detail/:id',
        loadComponent: () =>
          import('./pages/details/details.component').then(
            (m) => m.DetailsComponent
          ),
      },

      // Redirect inicial
      { path: '', pathMatch: 'full', redirectTo: 'home' },
    ],
  },

  // Catch-all
  { path: '**', redirectTo: '' },
];
