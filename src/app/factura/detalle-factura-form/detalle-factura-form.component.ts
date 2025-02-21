import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DetalleFacturaFormValues } from '@models/factura/detalle-factura/detalle-factura-form-values.model';
import { DetalleFactura } from '@models/factura/detalle-factura/detalle-factura.model';
import { FacturaService } from '@services/factura.service';
import { Subscription } from 'rxjs';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule} from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle-factura-form',
  standalone: true,
  imports: [ConfirmDialogModule, ToastModule, ReactiveFormsModule, InputTextModule, InputNumberModule, ButtonModule, CommonModule],
  templateUrl: './detalle-factura-form.component.html',
  styleUrl: './detalle-factura-form.component.scss',
  providers: [MessageService]
})
export class DetalleFacturaFormComponent implements OnInit, OnDestroy {
  idFactura: number;
  detalleFacturaToEdit?: DetalleFactura;
  form: FormGroup;

  subscriptions: Subscription[];

  constructor(private readonly _facturaService: FacturaService, 
    private readonly _messageService: MessageService, 
    public  dynamicDialogRef: DynamicDialogRef,
    private readonly _dynamicDialogConfig: DynamicDialogConfig
  ) {
    this.idFactura = this._dynamicDialogConfig.data.facturaId;
    this.detalleFacturaToEdit = this._dynamicDialogConfig.data.detalleFactura;
    this.form = this.createForm();
    this.subscriptions = [];
  }

  ngOnInit(): void {
    if(this.detalleFacturaToEdit) {
      this.loadFormValues();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  createForm(): FormGroup {
    return new FormGroup({
      producto: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      cantidad: new FormControl(null, [Validators.required, Validators.min(1)]),
      precioUnitario: new FormControl(null, [Validators.required, Validators.min(0.01)])
    });
  }

  loadFormValues(): void {
    this.form.patchValue(this.detalleFacturaToEdit!);
  }

  saveDetalleFactura(): void {
    if(this.detalleFacturaToEdit) {
      this.updateDetalleFactura();
    }else{
      this.createDetalleFactura();
    }
  }

  createDetalleFactura(): void {
    const createParams: DetalleFacturaFormValues = this.form.value;
    this.subscriptions.push(this._facturaService.createDetalleFactura(this.idFactura, createParams).subscribe({
      next: (detalleFacturaId: number) => {
        this.handleCreateDetalleFactura(detalleFacturaId, createParams);
      },
      error: () => {
        this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el detalle de factura', life: 3000, key: 'detalle-factura-form' });
      }
    }));
  }

  handleCreateDetalleFactura(detalleFacturaId: number, createParams: DetalleFacturaFormValues): void {
    const detalleFactura: DetalleFactura = {
      id: detalleFacturaId,
      ...createParams,
      facturaId: this.idFactura,
      subtotal: createParams.cantidad * createParams.precioUnitario
    }
    this.dynamicDialogRef.close(detalleFactura);
  }

  updateDetalleFactura(): void {
    const updateParams: DetalleFacturaFormValues = this.form.value;
    this.subscriptions.push(this._facturaService.updateDetalleFactura(this.detalleFacturaToEdit!.id, updateParams).subscribe({
      next: () => {
        this.handleUpdateDetalleFactura(updateParams);
      },
      error: () => {
        this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el detalle de factura', life: 3000, key: 'detalle-factura-form' });
      }
    }));
  }

  handleUpdateDetalleFactura(updateParams: DetalleFacturaFormValues): void {
    const updatedDetalleFactura: DetalleFactura = {
      ...this.detalleFacturaToEdit!,
      ...updateParams,
      subtotal: updateParams.cantidad * updateParams.precioUnitario
    }
    this.dynamicDialogRef.close(updatedDetalleFactura);
  }
  
  get producto() { return this.form.get('producto'); }
  get cantidad() { return this.form.get('cantidad'); }
  get precioUnitario() { return this.form.get('precioUnitario'); }
}
