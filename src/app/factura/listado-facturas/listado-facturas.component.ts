import { Component, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Factura } from '@models/factura/factura.model';
import { Subscription } from 'rxjs';
import { FacturaService } from '@services/factura.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule} from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DetalleFactura } from '@models/factura/detalle-factura/detalle-factura.model';

@Component({
  selector: 'app-listado-facturas',
  standalone: true,
  imports: [ButtonModule, CommonModule, TableModule, FormsModule, InputTextModule, ConfirmDialogModule, ToastModule],
  templateUrl: './listado-facturas.component.html',
  styleUrl: './listado-facturas.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class ListadoFacturasComponent implements OnInit, OnDestroy {
  facturas: Factura[];
  subscriptions: Subscription[];

  constructor(private readonly _facturaService: FacturaService,
    private readonly _confirmationService: ConfirmationService,
    private readonly _messageService: MessageService
  ) {
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

  deleteFacturaConfirmation(facturaId: number): void {
    this._confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar la factura?',
      header: 'Eliminar factura',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      acceptLabel:"Sí",
      rejectLabel:"No",
      rejectIcon:"none",
      rejectButtonStyleClass:"p-button-text",
      key: 'listado-facturas',
      accept: () => {
        this.deleteFactura(facturaId);
      }
    });
  }

  deleteDetalleFacturaConfirmation(detalleFactura: DetalleFactura): void {
    this._confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar el detalle de la factura?',
      header: 'Eliminar detalle de factura',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      acceptLabel:"Sí",
      rejectLabel:"No",
      rejectIcon:"none",
      rejectButtonStyleClass:"p-button-text",
      accept: () => {
        this.deleteDetalleFactura(detalleFactura);
      }
    });
  }

  deleteFactura(facturaId: number): void {
    this.subscriptions.push(this._facturaService.deleteFactura(facturaId).subscribe({
      next: () => {
        this.facturas = this.facturas.filter(factura => factura.id !== facturaId);
        this._messageService.add({ severity: 'info', summary: 'Acción ejecutada con exíto', detail: 'Se ha eliminado la factura satisfactoriamente' });
      },
      error: () => {
        this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar la factura', life: 3000 });
      }
    }));
  }

  deleteDetalleFactura(detalleFactura: DetalleFactura): void {
    this.subscriptions.push(this._facturaService.deleteDetalleFactura(detalleFactura.id).subscribe({
      next: () => {
        this.facturas.forEach(factura => {
          if (factura.id === detalleFactura.facturaId) {
            factura.detalles = factura.detalles.filter(detalle => detalle.id !== detalleFactura.id);
            factura.total = this.getTotalFactura(factura);
          }
        });
        this._messageService.add({ severity: 'info', summary: 'Acción ejecutada conéxito', detail: 'Se ha eliminado el detalle de la factura satisfactoriamente' });
      },
      error: () => {
        this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el detalle de la factura', life: 3000 });
      }
    }));
  }

  getTotalFactura(factura: Factura): number {
    return factura.detalles.reduce((acc, detalle) => acc + detalle.subtotal, 0);
  }

}
