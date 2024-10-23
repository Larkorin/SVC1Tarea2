import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IProduct, ISearch } from '../interfaces';
import { AuthService } from './auth.service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService extends BaseService<IProduct>{

  protected override source: string = 'productos';
  private productListSignal = signal<IProduct[]>([]);

  get producto$() {
    return this.productListSignal;
  }

  public search: ISearch = {
    page: 1,
    size: 5,
  }

  public totalItems: any = [];
  private authService: AuthService = inject(AuthService);
  private alertService: AlertService = inject(AlertService);  
  
  getAll() {
    this.findAllWithParams(this.search).subscribe({
      next: (response: any) => {
        this.search = {...this.search, ...response.meta};
        this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages: 0}, (_, i) => i+1);
        this.productListSignal.set(response.data);
        console.log("response", response);
        console.log("this search", this.search)
      },
      error: (err: any) => {
        console.log("error", err);
      }
    });
  }

  save(product: IProduct) {
    this.add(product).subscribe({
      next: (response: any) => {
        this.search = {...this.search, ...response.meta};
        this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages: 0}, (_, i) => i+1);
        this.productListSignal.set(response.data);
        this.alertService.displayAlert('success', 'Order created succesfully', 'center', 'top', ['success-snackbar']);
        this.getAll();
        console.log("response", response);
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error has occurred adding the category', 'center', 'top', ['error-snackbar']);
        console.log("error", err);
      }   
    });
  }
  
  update(product: IProduct) {
    this.editCustomSource(`${product.id}`, product).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', 'Order updated succesfully', 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred updating the order','center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

  
  delete(product: IProduct) {
    this.delCustomSource(`${product.id}`).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', 'Order deleted succesfully', 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred deleting the order','center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }
}
