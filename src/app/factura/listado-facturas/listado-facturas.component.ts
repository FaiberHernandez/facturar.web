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

  deleteFactura(facturaId: number): void {
    this.subscriptions.push(this._facturaService.deleteFactura(facturaId).subscribe({
      next: () => {
        this.facturas = this.facturas.filter(factura => factura.id !== facturaId);
        this._messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
      },
      error: () => {
        this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar la factura', life: 3000 });
      }
    }));
  }

}
