import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendaService {
  // URL base para a raiz da API
  private apiUrl = 'http://localhost:8087/api';

  constructor(private http: HttpClient) {}

  // Método existente corrigido com o novo caminho da URL base
  biparProduto(codigo: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/produtos/bipar/${codigo}`);
  }

  // Envia o payload exato que o Quarkus espera (VendaResourceDTO)
  fecharVenda(dadosCarrinho: { itens: { produtoId: number; quantidade: number }[] }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/vendas/fechar`, dadosCarrinho);
  }
}