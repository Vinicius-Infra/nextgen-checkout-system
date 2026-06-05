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
  constructor(private vendaService: VendaService) { }

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

  removerItemDoCarrinho(produtoId: number | undefined): void {
    if (!produtoId) return;

    this.carrinho = this.carrinho.filter(item => item.produto.id !== produtoId);

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

  concluirVenda(): void {
    // 1. Validação de segurança para carrinho vazio
    if (this.carrinho.length === 0) {
      this.mensagemErro = 'Não é possível fechar uma venda com o carrinho vazio!';
      return;
    }

    const payloadBackend = {
      itens: this.carrinho.map(item => ({
        produtoId: item.produto.id || 0,
        quantidade: item.quantidade
      }))
    };

    this.vendaService.fecharVenda(payloadBackend).subscribe({
      next: (resposta) => {
        const htmlDoCupom = resposta.cupomHtml;

        // 2. Criamos o container temporário aplicando a classe idêntica ao SCSS
        const printContainer = document.createElement('div');
        printContainer.className = 'secao-impressao-venda'; // Vincula com o @media print

        // 3. Injetamos as duas vias (Cliente e Estabelecimento)
        printContainer.innerHTML = `
          ${htmlDoCupom}
          <p style="text-align:center; font-family:monospace; margin:10px 0;">--------------------------------</p>
          <p style="text-align:center; font-family:monospace; font-size:10px; margin:0 0 10px 0;">VIA DO ESTABELECIMENTO</p>
          ${htmlDoCupom}
        `;

        // 4. Injeta, imprime e limpa o DOM
        document.body.appendChild(printContainer);
        window.print();
        document.body.removeChild(printContainer);

        // 5. Reseta o caixa com sucesso
        this.limparCupom();
      },
      error: (err) => {
        // 6. Captura dinâmica do erro de estoque enviado pelo Quarkus
        if (err.status === 400 && err.error && err.error.erro) {
          this.mensagemErro = err.error.erro; // Exibe: "Estoque insuficiente para o produto:..."
        } else {
          this.mensagemErro = 'Falha ao processar o fechamento da venda no servidor.';
        }
        console.error(err);
      }
    });
  }
}
