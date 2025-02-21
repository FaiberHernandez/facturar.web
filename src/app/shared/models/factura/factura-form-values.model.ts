import { DetalleFacturaFormValues } from "./detalle-factura/detalle-factura-form-values.model";
import { Factura } from "./factura.model";

export interface FacturaFormValues extends Omit<Factura, 'id' | 'total' | 'detalles'> {
  detalles: DetalleFacturaFormValues;

  redirectToFacturas: boolean;
}