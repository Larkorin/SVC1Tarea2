import { CategoriesFormComponent } from './../../components/categories/categories-form/categories-form.component';
import { Component, inject, ViewChild } from '@angular/core';
import { CategoriesListComponent } from '../../components/categories/categories-list/categories-list.component';
import { CategoriesService } from '../../services/categories.service';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalService } from '../../services/modal.service';
import { ICategory } from '../../interfaces';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CategoriesListComponent,
    PaginationComponent,
    ModalComponent,
    LoaderComponent,
    CategoriesFormComponent
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  public categoriesService: CategoriesService = inject(CategoriesService);
  public modalService: ModalService = inject(ModalService);
  public authService: AuthService = inject(AuthService);
  @ViewChild('addCategoriesModal') public addCategoriesModal: any;
  public fb: FormBuilder = inject(FormBuilder);

  public route: ActivatedRoute = inject(ActivatedRoute);
  public routeAuthorities: string[] = [];
  public areActionsAvailable: boolean = false;

  categoriesForm = this.fb.group({
    id: [''],
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required]
  })

  constructor() {
    this.categoriesService.search.page = 1;
    this.categoriesService.getAll();
  }

  saveCategory(category: ICategory) {
    this.categoriesService.save(category);
    this.modalService.closeAll();
  }

  callEdition(category: ICategory){
    this.categoriesForm.controls['id'].setValue(category.id ? JSON.stringify(category.id) : '');
    this.categoriesForm.controls['nombre'].setValue(category.nombre ? category.nombre : '');
    this.categoriesForm.controls['descripcion'].setValue(category.descripcion ? category.descripcion : '');
    this.modalService.displayModal('md', this.addCategoriesModal)
  }

  updateCategory(category : ICategory) {
    this.categoriesService.update(category);
    this.modalService.closeAll();
  }

  ngOnInit(): void {
    this.authService.getUserAuthorities();
    this.route.data.subscribe( data => {
      this.routeAuthorities = data['authorities'] ? data['authorities'] : [];
      this.areActionsAvailable = this.authService.areActionsAvailable(this.routeAuthorities);
    });
  }
}
