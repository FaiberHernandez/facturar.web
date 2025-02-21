import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DetalleFacturaFormValues } from '@models/factura/detalle-factura/detalle-factura-form-values.model';
import { DetalleFactura } from '@models/factura/detalle-factura/detalle-factura.model';
import { FacturaService } from '@services/factura.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-detalle-factura-form',
  standalone: true,
  imports: [],
  templateUrl: './detalle-factura-form.component.html',
  styleUrl: './detalle-factura-form.component.scss'
})
export class DetalleFacturaFormComponent implements OnInit {
  idFactura: number;
  detalleFacturaToEdit?: DetalleFactura;
  form: FormGroup;

  subscriptions: Subscription[];

  constructor(private readonly _facturaService: FacturaService) {
    this.idFactura = 0;
    this.form = this.createForm();
    this.subscriptions = [];
  }

  ngOnInit(): void {
    if(this.detalleFacturaToEdit) {
      this.loadFormValues();
    }
  }

  createForm(): FormGroup {
    return new FormGroup({
      producto: new FormControl('', Validators.required),
      cantidad: new FormControl('', Validators.required),
      precioUnitario: new FormControl('', Validators.required)
    });
  }

  loadFormValues(): void {
    this.form.patchValue(this.detalleFacturaToEdit!);
  }

  createDetalleFactura(): void {
    const createParams: DetalleFacturaFormValues = this.form.value;
    this.subscriptions.push(this._facturaService.createDetalleFactura(this.idFactura, createParams).subscribe({
      next: (detalleFacturaId: number) => {
        console.log('Detalle factura creado', detalleFacturaId);
      },
      error: (error) => {
        console.error('Error al crear el detalle factura', error);
      }
    }));
  }
  
  get producto() { return this.form.get('producto'); }
  get cantidad() { return this.form.get('cantidad'); }
  get precioUnitario() { return this.form.get('precioUnitario'); }
}
