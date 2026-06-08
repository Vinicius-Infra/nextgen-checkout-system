import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-produto-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './produto-lista.component.html',
  styleUrl: './produto-lista.component.scss',
})
export class ProdutoListaComponent implements OnInit {

  produtos: Produto[] = [];
  exibirModal = false; // Controla a visibilidade da modal
  mensagemErro: string = '';
  modoEdicao: boolean = false; // Define se a modal está salvando ou atualizando

  // Objeto que herda a nossa Interface para o formulário
  novoProduto: Produto = {
    nome: '',
    codigoBarras: '',
    preco: 0,
    quantidadeEstoque: 0
  };

  constructor(private produtoService: ProdutoService) { }

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.produtoService.listarTodos().subscribe({
      next: (dados) => this.produtos = dados,
      error: (erro) => console.error('Erro ao buscar produtos:', erro)
    });
  }

  // Abre a modal configurada para inserção
  abrirModalCadastro(): void {
    this.modoEdicao = false;
    this.novoProduto = { nome: '', codigoBarras: '', preco: 0, quantidadeEstoque: 0 };
    this.mensagemErro = '';
    this.exibirModal = true;
  }

  // Abre a modal clonando o produto selecionado para edição
  abrirModalEdicao(produto: Produto): void {
    this.modoEdicao = true;
    this.mensagemErro = '';
    // Usa o operador Spread (...) para desestruturar e clonar o objeto.
    // Isso evita que o texto mude direto na tabela da tela enquanto o usuário digita.
    this.novoProduto = { ...produto }; 
    this.exibirModal = true;
  }

  fecharModal(): void {
    this.exibirModal = false;
    this.mensagemErro = '';
  }

  // Decide dinamicamente se envia um POST (criar) ou um PUT (atualizar) ao Quarkus
  salvarProduto(): void {
    if (!this.novoProduto.nome || !this.novoProduto.codigoBarras) {
      this.mensagemErro = 'Por favor, preencha o Nome e o Código de Barras!';
      return;
    }

    if (this.modoEdicao && this.novoProduto.id) {
      // Fluxo do ALVO 2: Atualização / Reabastecimento (PUT)
      this.produtoService.atualizar(this.novoProduto.id, this.novoProduto).subscribe({
        next: (res) => {
          this.fecharModal();
          this.carregarProdutos();
        },
        error: (err) => this.tratarErroServidor(err)
      });
    } else {
      // Fluxo do ALVO 1: Cadastro Original (POST)
      this.produtoService.criar(this.novoProduto).subscribe({
        next: (res) => {
          this.fecharModal();
          this.carregarProdutos();
        },
        error: (err) => this.tratarErroServidor(err)
      });
    }
  }

  // Trata erros de duplicidade ou indisponibilidade de servidor centralizadamente
  private tratarErroServidor(err: any): void {
    if (err.status === 409 && err.error && err.error.erro) {
      this.mensagemErro = err.error.erro;
    } else {
      this.mensagemErro = 'Erro ao processar requisição no servidor.';
    }
    console.error(err);
  }
}