import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ProductFormComponent } from '../../components/products/product-form/product-form.component';
import { ProductsService } from '../../services/products.service';
import { ModalService } from '../../services/modal.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { IProduct } from '../../interfaces';
import { ProductListComponent } from '../../components/products/product-list/product-list.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    ProductListComponent,
    PaginationComponent,
    ModalComponent,
    LoaderComponent,
    ProductFormComponent
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit{
  public productosService: ProductsService = inject(ProductsService);
  public modalService: ModalService = inject(ModalService);
  public authService: AuthService = inject(AuthService);
  @ViewChild('addProductsModal') public addProductsModal: any;
  public fb: FormBuilder = inject(FormBuilder);

  
  public route: ActivatedRoute = inject(ActivatedRoute);
  public routeAuthorities: string[] = [];
  public areActionsAvailable: boolean = false;

  currentProduct: IProduct | null = null; // CHAT GPT

  productsForm = this.fb.group({
    id: [''],
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    precio: ['', Validators.required],
    cantidadStock: ['', Validators.required],
    nombreCategoria: ['', Validators.required]
  })

  constructor() {
    this.productosService.search.page = 1;
    this.productosService.getAll();
  }

  saveProduct(product: IProduct) {
    this.productosService.save(product);
    this.modalService.closeAll();
  }

  callEdition(product: IProduct): void {
    this.currentProduct = product; 
    this.productsForm.patchValue({
      id: String(product.id),
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: String(product.precio),
      cantidadStock: String(product.cantidadStock),
      nombreCategoria: product.categoria?.nombre 
    });
    this.modalService.displayModal('md', this.addProductsModal);
  }

  updateProduct(): void {
    if (this.currentProduct) {
      const updatedProduct: IProduct = {
        id: this.currentProduct.id, 
        nombre: this.productsForm.value.nombre ?? '',
        descripcion: this.productsForm.value.descripcion ?? '', 
        precio: Number(this.productsForm.value.precio), 
        cantidadStock: Number(this.productsForm.value.cantidadStock), 
        nombreCategoria: this.productsForm.value.nombreCategoria ?? ''
      };
      this.productosService.update(updatedProduct);
      this.modalService.closeAll(); 
    }
  }  
  ngOnInit(): void {
    this.authService.getUserAuthorities();
    this.route.data.subscribe( data => {
      this.routeAuthorities = data['authorities'] ? data['authorities'] : [];
      this.areActionsAvailable = this.authService.areActionsAvailable(this.routeAuthorities);
    });
  }
}
