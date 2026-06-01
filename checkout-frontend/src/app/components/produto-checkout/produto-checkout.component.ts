import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { VendaService } from '../../services/venda.service';
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

  // Injetando apenas o VendaService que gerencia o fluxo de venda/bipe
  constructor(private vendaService: VendaService) {}

  buscarProduto(): void {
    if (!this.codigoPesquisa.trim()) return;

    // Consumindo o endpoint real do Quarkus via VendaService
    this.vendaService.biparProduto(this.codigoPesquisa.trim()).subscribe({
      next: (produtoAchado: Produto) => {
        // Se o Quarkus achar o produto, adicionamos ou incrementamos no carrinho local
        this.adicionarAoCarrinho(produtoAchado);
        this.codigoPesquisa = ''; // Limpa o input para o próximo item
        this.mensagemErro = '';
      },
      error: (err) => {
        // Se o Quarkus devolver 404 (Not Found), cai aqui automaticamente
        if (err.status === 404) {
          this.mensagemErro = 'Produto não cadastrado ou código inválido!';
        } else {
          this.mensagemErro = 'Erro de comunicação com o servidor backend.';
        }
        this.codigoPesquisa = ''; // Limpa para o operador tentar de novo
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
