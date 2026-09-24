import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/photo-list/photo-list.component').then(m => m.PhotoListComponent),
    data: { section: 'photos' },
  },
  {
    path: 'favorites',
    loadComponent: () => import('./features/favorites/favorites.component').then(m => m.FavoritesComponent),
    data: { section: 'favorites' },
  },
  {
    path: 'photos/:id',
    loadComponent: () =>
      import('./features/favorites/components/photo-details/photo-details.component').then(
        m => m.PhotoDetailsComponent,
      ),
    data: { section: 'favorites' },
  },
  {
    path: '**',
    redirectTo: '',
  },
];
