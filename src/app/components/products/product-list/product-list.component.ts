import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IProduct } from '../../../interfaces';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  @Input() title: string  = '';
  @Input() products: IProduct[] = [];
  
  @Input() areActionsAvailable: boolean = false;
  
  @Output() callModalAction: EventEmitter<IProduct> = new EventEmitter<IProduct>();
  @Output() callDeleteAction: EventEmitter<IProduct> = new EventEmitter<IProduct>();

  constructor() {
    console.log('title', this.title);
  }
  ngOnInit(): void {
    console.log('title', this.title);
  }
}
