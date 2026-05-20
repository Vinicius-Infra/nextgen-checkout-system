import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from '../models/produto';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  // URL apontando direto para o nosso backend Quarkus
  private apiUrl = 'http://localhost:8087/api/produtos';

  constructor(private http: HttpClient) { }

  // Método para listar todos os produtos do supermercado
  listarTodos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl);
  }

  // Método para cadastrar um novo produto
  criar(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto);
  }
}