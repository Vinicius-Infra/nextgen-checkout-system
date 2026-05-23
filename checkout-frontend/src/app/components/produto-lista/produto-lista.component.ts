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

  // Envia o novo produto para o Quarkus salvar no Postgres
  salvarProduto(): void {
    if (!this.novoProduto.nome || !this.novoProduto.codigoBarras) {
      alert('Por favor, preencha o Nome e o Código de Barras!');
      return;
    }

    this.produtoService.criar(this.novoProduto).subscribe({
      next: () => {
        this.exibirModal = false; // Fecha a modal
        this.carregarProdutos(); // Recarrega a tabela automaticamente com o item novo!
      },
      error: (erro) => {
        console.error('Erro ao cadastrar produto:', erro);
        alert('Erro ao salvar produto no servidor.');
      }
    });
  }
}