import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Factura } from '../models/factura/factura.model';
import { environment } from '../../../environments/environment.prod';
import { DetalleFacturaFormValues } from '@models/factura/detalle-factura/detalle-factura-form-values.model';
import { Observable } from 'rxjs';
import { FacturaFormValues } from '@models/factura/factura-form-values.model';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  constructor(private readonly _http: HttpClient) { }

  getFacturas(): Observable<Factura[]> {
    return this._http.get<Factura[]>(environment.facturapi+'Factura');
  }

  deleteFactura(facturaId: number): Observable<null> {
    return this._http.delete<null>(environment.facturapi+'Factura/'+facturaId);
  }

  deleteDetalleFactura(detalleFacturaId: number) {
    return this._http.delete(environment.facturapi+'DetalleFactura/'+detalleFacturaId);
  }

  createDetalleFactura(facturaId: number, detalleFactura: DetalleFacturaFormValues): Observable<number> {
    return this._http.post<number>(environment.facturapi+'Factura/'+facturaId+'/detalle', detalleFactura);
  }

  updateDetalleFactura(detalleFacturaId: number, detalleFactura: DetalleFacturaFormValues): Observable<null> {
    return this._http.put<null>(environment.facturapi+'DetalleFactura/'+detalleFacturaId, detalleFactura);
  }

  createFactura(factura: FacturaFormValues): Observable<number> {
    return this._http.post<number>(environment.facturapi+'Factura', factura);
  }

  getFacturaById(facturaId: number): Observable<Factura> {
    return this._http.get<Factura>(environment.facturapi+'Factura/'+facturaId);
  }

  editFactura(facturaId: number, factura: FacturaFormValues): Observable<null> {
    return this._http.put<null>(environment.facturapi+'Factura/'+facturaId, factura);
  }

}
