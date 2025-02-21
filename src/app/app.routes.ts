import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    pathMatch: 'full',
    path: '',
    redirectTo: '/administrar-facturas/listado-facturas'
  },
  {
    path: 'administrar-facturas',
    loadChildren: () => import('./factura/factura.routes').then(r => r.routes)
  }
];