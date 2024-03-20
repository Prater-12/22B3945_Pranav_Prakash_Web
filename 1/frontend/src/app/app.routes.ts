// Angular modules
import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@services/auth.service';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth.routes').then((m) => m.routes),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    canActivate: [
      () => {
        if (inject(AuthService).isAuthenticated()) {
          return true;
        } else {
          const router: Router = inject(Router);
          return router.createUrlTree(['auth/login']);
        }
      },
    ],
  },
  {
    path: 'add-user',
    loadComponent: () =>
      import('./pages/add/add-user/add-user.component').then(
        (m) => m.AddUserComponent
      ),
    canActivate: [
      () => {
        if (inject(AuthService).isAuthenticated()) {
          return true;
        } else {
          const router: Router = inject(Router);
          return router.createUrlTree(['auth/login']);
        }
      },
    ],
  },
  {
    path: 'add-document',
    loadComponent: () =>
      import('./pages/add/add-doc/add-doc.component').then(
        (m) => m.AddDocComponent
      ),
    canActivate: [
      () => {
        if (inject(AuthService).isAuthenticated()) {
          return true;
        } else {
          const router: Router = inject(Router);
          return router.createUrlTree(['auth/login']);
        }
      },
    ],
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
