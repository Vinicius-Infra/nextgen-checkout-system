import { Routes } from '@angular/router';
import { ProdutoListaComponent } from './components/produto-lista/produto-lista.component';
// CORREÇÃO: Garanta que o nome do arquivo termine exatamente em .component
import { ProdutoCheckoutComponent } from './components/produto-checkout/produto-checkout.component';

export const routes: Routes = [
  { path: '', component: ProdutoCheckoutComponent }, 
  { path: 'produtos', component: ProdutoListaComponent }, 
  { path: '**', redirectTo: '' }
];