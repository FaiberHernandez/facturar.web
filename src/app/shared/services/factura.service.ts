import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Factura } from '../models/factura/factura.model';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  constructor(private readonly _http: HttpClient) { }

  getFacturas() {
    return this._http.get<Factura[]>(environment.facturapi+'Factura');
  }
}
