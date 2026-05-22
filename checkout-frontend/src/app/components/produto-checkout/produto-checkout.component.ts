import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto';

interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
  totalItem: number;
}

@Component({
  selector: 'app-produto-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './produto-checkout.component.html',
  styleUrl: './produto-checkout.component.scss'
})
export class ProdutoCheckoutComponent {
  codigoPesquisa: string = '';
  carrinho: ItemCarrinho[] = [];
  valorTotalGeral: number = 0;
  mensagemErro: string = '';

  constructor(private produtoService: ProdutoService) {}

  buscarProduto(): void {
    if (!this.codigoPesquisa.trim()) return;

    // Reaproveitando o Service que você já validou!
    this.produtoService.listarTodos().subscribe({
      next: (produtos) => {
        // Simula a busca por código de barras na lista vinda do Quarkus
        const produtoAchado = produtos.find(p => p.codigoBarras === this.codigoPesquisa.trim());

        if (produtoAchado) {
          this.adicionarAoCarrinho(produtoAchado);
          this.codigoPesquisa = ''; // Limpa o input para o próximo item
          this.mensagemErro = '';
        } else {
          this.mensagemErro = 'Produto não encontrado ou código inválido!';
        }
      },
      error: (err) => {
        console.error('Erro ao buscar produto no checkout:', err);
        this.mensagemErro = 'Erro de comunicação com o servidor.';
      }
    });
  }

  adicionarAoCarrinho(produto: Produto): void {
    const itemExistente = this.carrinho.find(item => item.produto.id === produto.id);

    if (itemExistente) {
      itemExistente.quantidade++;
      itemExistente.totalItem = itemExistente.quantidade * (produto.preco || 0);
    } else {
      this.carrinho.push({
        produto: produto,
        quantidade: 1,
        totalItem: produto.preco || 0
      });
    }

    this.atualizarTotalGeral();
  }

  atualizarTotalGeral(): void {
    this.valorTotalGeral = this.carrinho.reduce((acc, item) => acc + item.totalItem, 0);
  }

  limparCupom(): void {
    this.carrinho = [];
    this.valorTotalGeral = 0;
    this.mensagemErro = '';
  }
}