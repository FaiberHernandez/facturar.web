import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DetalleFactura } from '@models/factura/detalle-factura/detalle-factura.model';
import { Factura } from '@models/factura/factura.model';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { FacturaFormValues } from '@models/factura/factura-form-values.model';

@Component({
  selector: 'app-factura-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, InputNumberModule, ButtonModule, CalendarModule, CommonModule, DividerModule, TableModule],
  templateUrl: './factura-form.component.html',
  styleUrl: './factura-form.component.scss'
})
export class FacturaFormComponent implements OnInit {
  @Input() facturaToEdit?: Factura;
  @Output() saveFacturaChange: EventEmitter<FacturaFormValues>;

  totalFactura: number;
  form: FormGroup;
  detalleFacturaForm: FormGroup;
  detallesFactura: DetalleFactura[];

  constructor() {
    this.totalFactura = 0;
    this.form = this.createForm();
    this.saveFacturaChange = new EventEmitter<FacturaFormValues>();
    this.detalleFacturaForm = this.createDetalleFacturaForm();
    this.detallesFactura = [];
  }

  ngOnInit(): void {
    if(this.facturaToEdit) {
      this.form.patchValue(this.facturaToEdit);
      this.fecha?.setValue(new Date(this.facturaToEdit.fecha));
      this.detallesFactura = this.facturaToEdit.detalles;
      this.totalFactura = this.getTotalFactura();
    }
  }

  createForm(): FormGroup {
    return new FormGroup({
      cliente: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      fecha: new FormControl(new Date(), [Validators.required])
    });
  }

  createDetalleFacturaForm(): FormGroup {
    return new FormGroup({
      producto: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      cantidad: new FormControl(null, [Validators.required, Validators.min(1)]),
      precioUnitario: new FormControl(null, [Validators.required, Validators.min(0.01)])
    });
  }

  getTotalFactura(): number {
    return this.detallesFactura.reduce((acc, detalle) => acc + detalle.cantidad * detalle.precioUnitario, 0);
  }

  addDetalleFactura(): void {
    this.detallesFactura = [...this.detallesFactura, this.detalleFacturaForm.value];
    this.totalFactura = this.getTotalFactura();
    this.detalleFacturaForm.reset();
  }

  removeDetalleFactura(index: number): void {
    this.detallesFactura = this.detallesFactura.filter((_, i) => i !== index);
    this.totalFactura = this.getTotalFactura();
  }

  saveFactura(redirectToFacturas: boolean = false): void {
    const facturaFormValues: FacturaFormValues = {
      ...this.form.value,
      detalles: this.detallesFactura,
      redirectToFacturas
    };

    this.saveFacturaChange.emit(facturaFormValues);

    if(!redirectToFacturas && !this.facturaToEdit) {
      this.form.reset();
      this.detalleFacturaForm.reset();
      this.detallesFactura = [];
      this.totalFactura = 0;
      this.fecha?.setValue(new Date());
    }
  }

  get cliente() { return this.form.get('cliente'); }
  get fecha() { return this.form.get('fecha'); }

  get producto() { return this.detalleFacturaForm.get('producto'); }
  get cantidad() { return this.detalleFacturaForm.get('cantidad'); }
  get precioUnitario() { return this.detalleFacturaForm.get('precioUnitario'); }
}
