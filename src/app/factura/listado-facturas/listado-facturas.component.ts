import { Component, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Factura } from '@models/factura/factura.model';
import { Subscription } from 'rxjs';
import { FacturaService } from '@services/factura.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-listado-facturas',
  standalone: true,
  imports: [ButtonModule, CommonModule, TableModule, FormsModule, InputTextModule],
  templateUrl: './listado-facturas.component.html',
  styleUrl: './listado-facturas.component.scss'
})
export class ListadoFacturasComponent implements OnInit, OnDestroy {
  facturas: Factura[];
  subscriptions: Subscription[];

  constructor(private readonly _facturaService: FacturaService) {
    this.facturas = [];
    this.subscriptions = [];
  }

  ngOnInit(): void {
    this.getFacturas();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getFacturas(): void {
    this.subscriptions.push(this._facturaService.getFacturas().subscribe({
      next: (listadoFacturas: Factura[]) => {
        this.facturas = listadoFacturas;
      },
      error: (error) => {
        console.error('Error al obtener las facturas', error);
      }
    }));
  }

}
