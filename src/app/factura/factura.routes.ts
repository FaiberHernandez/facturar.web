import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./factura.component').then(m => m.FacturaComponent),
    children: [
      {
        path: 'listado-facturas',
        loadComponent: () => import('./listado-facturas/listado-facturas.component').then(m => m.ListadoFacturasComponent)
      },
      {
        path: 'crear-factura',
        loadComponent: () => import('./crear-factura/crear-factura.component').then(m => m.CrearFacturaComponent)
      },
      {
        path: 'editar-factura/:id',
        loadComponent: () => import('./editar-factura/editar-factura.component').then(m => m.EditarFacturaComponent)
      }
    ]
  }
];