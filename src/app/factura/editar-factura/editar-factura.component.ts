import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FacturaFormValues } from '@models/factura/factura-form-values.model';
import { FacturaService } from '@services/factura.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { FacturaFormComponent } from '../factura-form/factura-form.component';
import { Factura } from '@models/factura/factura.model';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-editar-factura',
  standalone: true,
  imports: [ToastModule, FacturaFormComponent, RouterModule, ProgressSpinnerModule],
  templateUrl: './editar-factura.component.html',
  styleUrl: './editar-factura.component.scss',
  providers: [MessageService]
})
export class EditarFacturaComponent implements OnInit, OnDestroy {
  facturaToEdit?: Factura;
  subscriptions: Subscription[];

  constructor(private readonly _facturaService: FacturaService, 
    private readonly _messageService: MessageService, 
    private readonly _router: Router, 
    private readonly _activatedRoute: ActivatedRoute) {
    this.subscriptions = [];
  }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe((params) => {
      const id = Number(params['id']);
      if(id) {
        this.getFacturaById(id);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getFacturaById(id: number): void {
    this.subscriptions.push(this._facturaService.getFacturaById(id).subscribe({
      next: (factura) => {
        this.facturaToEdit = factura;
      }
    }));
  }

  saveFactura(factura: FacturaFormValues): void {
    this.subscriptions.push(this._facturaService.editFactura(this.facturaToEdit!.id, factura).subscribe({
      next: () => {
        this._messageService.add({severity:'success', summary:'Cambios realizados', detail:'Factura guardada satisfactoriamente'});
        if(factura.redirectToFacturas) {
          setTimeout(() => {
            this._router.navigateByUrl('/administrar-facturas/listado-facturas');
          },2000);
        }
      }
    }));
  }
}
