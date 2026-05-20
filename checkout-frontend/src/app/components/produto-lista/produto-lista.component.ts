import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importação crucial para diretivas estruturais
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto';

@Component({
  selector: 'app-produto-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './produto-lista.component.html', // Bate com o novo nome
  styleUrl: './produto-lista.component.scss'     // Bate com o novo nome
})
export class ProdutoListaComponent implements OnInit {
  
  produtos: Produto[] = [];

  constructor(private produtoService: ProdutoService) { }

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.produtoService.listarTodos().subscribe({
      next: (dados) => {
        this.produtos = dados;
      },
      error: (erro) => {
        console.error('Erro ao buscar produtos do Quarkus:', erro);
      }
    });
  }
}