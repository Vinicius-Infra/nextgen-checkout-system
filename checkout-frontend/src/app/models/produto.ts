export interface Produto {
  
  id?: number; // Opcional porque no cadastro ele ainda não existe
  nome: string;
  codigoBarras: string;
  preco: number;
  quantidadeEstoque: number;
}
