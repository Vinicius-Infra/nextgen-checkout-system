import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 1. IMPORTANTE: Adicione o FormsModule para habilitar o [(ngModel)]
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto';

@Component({
  selector: 'app-produto-lista',
  standalone: true,
  imports: [CommonModule, FormsModule], // 2. IMPORTANTE: Registre o FormsModule aqui
  templateUrl: './produto-lista.component.html',
  styleUrl: './produto-lista.component.scss'
})
export class ProdutoListaComponent implements OnInit {

  produtos: Produto[] = [];
  exibirModal = false; // Controla a visibilidade da modal

  mensagemErro: string = '';

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

  // Abre a modal limpando o formulário anterior
  abrirModalCadastro(): void {
    this.novoProduto = { nome: '', codigoBarras: '', preco: 0, quantidadeEstoque: 0 };
    this.exibirModal = true;
  }

  fecharModal(): void {
    this.exibirModal = false;
    this.mensagemErro = ''; // Limpa o erro ao fechar para não sumir com o modal poluído depois
  }

  // Envia o novo produto para o Quarkus salvar no Postgres
  salvarProduto(): void {
    if (!this.novoProduto.nome || !this.novoProduto.codigoBarras) {
      alert('Por favor, preencha o Nome e o Código de Barras!');
      return;
    }

    this.produtoService.criar(this.novoProduto).subscribe({
      next: (res) => {
        this.fecharModal();
        this.carregarProdutos();
        this.mensagemErro = '';
      },
      error: (err) => {
        // Captura dinâmica do erro 409 enviado pelo Quarkus
        if (err.status === 409 && err.error && err.error.erro) {
          this.mensagemErro = err.error.erro; // "Já existe um produto cadastrado com este código de barras"
        } else {
          this.mensagemErro = 'Erro ao salvar produto no servidor.';
        }
        console.error(err);
      }
    });
  }
}