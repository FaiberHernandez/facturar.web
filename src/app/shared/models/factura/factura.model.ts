import { DetalleFactura } from "./detalle-factura/detalle-factura.model";

export interface Factura {
  id: number;
  cliente: string;
  fecha: string;
  total: number;
  detalles: DetalleFactura[];
}