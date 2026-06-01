import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendaService {
  private apiUrl = 'http://localhost:8087/api/produtos/bipar';

  constructor(private http: HttpClient) {}

  biparProduto(codigo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${codigo}`);
  }
}
