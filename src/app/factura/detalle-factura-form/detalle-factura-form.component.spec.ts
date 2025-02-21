import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleFacturaFormComponent } from './detalle-factura-form.component';

describe('DetalleFacturaFormComponent', () => {
  let component: DetalleFacturaFormComponent;
  let fixture: ComponentFixture<DetalleFacturaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleFacturaFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetalleFacturaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
