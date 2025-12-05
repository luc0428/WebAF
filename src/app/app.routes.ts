import { Routes } from '@angular/router';
import { Criar } from './criar/criar';

export const routes: Routes = [
  { path: '', redirectTo: '/lista', pathMatch: 'full' },
  { path: 'lista', loadComponent: () => import('./lista/lista').then(m => m.Lista) },
  { path: 'criar', component: Criar },
  { path: 'editar/:id', loadComponent: () => import('./editar/editar').then(m => m.Editar) }
];
