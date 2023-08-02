import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { toaster } from 'src/app/app.component';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  isLoading: boolean = false;

  products: Map<string, Array<Emprendimiento>>;

  constructor(private productService: ProductService) {
    this.products = new Map<string, Array<Emprendimiento>>();
  }

  ngOnInit(): void {

    this.getProducts();
  }


  getProducts() {
    this.isLoading = true;

    this.productService.getProducts()
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe(
        (res: Product[]) => {
          if(!!res) this.groupProducts(res);
        },
        error => {
          console.log(error);
          toaster.error(
            `Ha ocurrido un error al obtener los productos del cliente.`,
            'Error '
          );
        }
      );
  }


  groupProducts(products: Product[]){

    products.forEach( p => {

      let emp = new Emprendimiento(p.emprendimiento, p);

      let listEmp = this.products.get(p.bu);
      if(listEmp !== undefined){
        listEmp.push(emp);
      } else {
        listEmp = new Array<Emprendimiento>(emp);
        this.products.set(p.bu, listEmp);
      }
    });

  }

}


export class Emprendimiento {
  name: string;
  products: Product[];

  constructor(name: string, prod: Product) {
    this.name = name;
    this.products = new Array<Product>(prod);
  }

}
