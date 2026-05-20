import { Routes } from '@angular/router';
// CORREÇÃO: Usar ./ em vez de ../ porque a pasta components está na mesma pasta que as rotas
import { ProdutoListaComponent } from './components/produto-lista/produto-lista.component';

export const routes: Routes = [
  { path: '', component: ProdutoListaComponent },
  { path: '**', redirectTo: '' }
];