import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICategory } from '../../../interfaces';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss'
})
export class CategoriesListComponent implements OnInit{
  @Input() title: string  = '';
  @Input() categories: ICategory[] = [];
    
  @Input() areActionsAvailable: boolean = false;
  
  @Output() callModalAction: EventEmitter<ICategory> = new EventEmitter<ICategory>();
  @Output() callDeleteAction: EventEmitter<ICategory> = new EventEmitter<ICategory>();
  
  constructor() {
    console.log('title', this.title);
  }
  ngOnInit(): void {
    console.log('title', this.title);
  }
}
