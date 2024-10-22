import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ICategory } from '../../../interfaces';
import { take } from 'rxjs';

@Component({
  selector: 'app-categories-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './categories-form.component.html',
  styleUrl: './categories-form.component.scss'
})
export class CategoriesFormComponent {
  public fb: FormBuilder = inject(FormBuilder);
  @Input() categoriesForm!: FormGroup;
  @Output() callSaveMethod: EventEmitter<ICategory> = new EventEmitter<ICategory>();
  @Output() callUpdateMethod: EventEmitter<ICategory> = new EventEmitter<ICategory>();


  callSave() {
    let newCategory: ICategory = {
      nombre: this.categoriesForm.controls["nombre"].value,
      descripcion: this.categoriesForm.controls["descripcion"].value
    }  

    if(this.categoriesForm.controls['id'].value){
      newCategory.id = this.categoriesForm.controls['id'].value;
    }

    if(newCategory.id){
      this.callUpdateMethod.emit(newCategory);
    } else {
      this.callSaveMethod.emit(newCategory);
    }
  }
}
