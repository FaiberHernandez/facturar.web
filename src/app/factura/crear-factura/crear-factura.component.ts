import { Component, OnDestroy } from '@angular/core';
import { FacturaFormComponent } from '../factura-form/factura-form.component';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { FacturaService } from '@services/factura.service';
import { FacturaFormValues } from '@models/factura/factura-form-values.model';
import { ToastModule} from 'primeng/toast';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-crear-factura',
  standalone: true,
  imports: [FacturaFormComponent, RouterModule, ToastModule],
  templateUrl: './crear-factura.component.html',
  styleUrl: './crear-factura.component.scss',
  providers: [MessageService]
})
export class CrearFacturaComponent implements OnDestroy {

  subscriptions: Subscription[];

  constructor(private readonly _facturaService: FacturaService, private readonly _messageService: MessageService, private readonly _router: Router) {
    this.subscriptions = [];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  createFactura(factura: FacturaFormValues): void {
    this.subscriptions.push(this._facturaService.createFactura(factura).subscribe({
      next: () => {
        this._messageService.add({severity:'success', summary:'Factura generada', detail:'Factura generada satisfactoriamente'});
        if(factura.redirectToFacturas) {
          setTimeout(() => {
            this._router.navigateByUrl('/administrar-facturas/listado-facturas');
          },2000);
        }
      }
    }));
  }

}
