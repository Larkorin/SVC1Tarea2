import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ICategory, IProduct } from '../../../interfaces';

@Component({
  selector: 'app-products-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {
  public fb: FormBuilder = inject(FormBuilder);
  @Input() productsForm!: FormGroup;
  @Output() callSaveMethod: EventEmitter<IProduct> = new EventEmitter<IProduct>();
  @Output() callUpdateMethod: EventEmitter<IProduct> = new EventEmitter<IProduct>();

  callSave() {
    let newProduct: IProduct = {
      nombre: this.productsForm.controls["nombre"].value,
      descripcion: this.productsForm.controls["descripcion"].value,
      precio: this.productsForm.controls["precio"].value,
      cantidadStock: this.productsForm.controls["cantidadStock"].value,
      nombreCategoria: this.productsForm.controls["nombreCategoria"].value
    }  

    if(this.productsForm.controls['id'].value){
      newProduct.id = this.productsForm.controls['id'].value;
    }

    if(newProduct.id){
      this.callUpdateMethod.emit(newProduct);
    } else {
      this.callSaveMethod.emit(newProduct);
    }
  }
}
