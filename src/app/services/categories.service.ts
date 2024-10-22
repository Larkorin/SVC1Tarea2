import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ICategory, ISearch } from '../interfaces';
import { AuthService } from './auth.service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService extends BaseService<ICategory>{

  protected override source: string = 'categorias';
  private categoryListSignal = signal<ICategory[]>([]);
  get categoria$() {
    return this.categoryListSignal;
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
        this.categoryListSignal.set(response.data);
        console.log("response", response);
        console.log("this search", this.search)
      },
      error: (err: any) => {
        console.log("error", err);
      }
    });
  }

  save(category: ICategory) {
    this.add(category).subscribe({
      next: (response: any) => {
        this.search = {...this.search, ...response.meta};
        this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages: 0}, (_, i) => i+1);
        this.categoryListSignal.set(response.data);
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

  update(category: ICategory) {
    this.editCustomSource(`${category.id}`, category).subscribe({
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

  delete(category: ICategory) {
    this.delCustomSource(`${category.id}`).subscribe({
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
