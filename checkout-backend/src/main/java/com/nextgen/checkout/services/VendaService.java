package com.nextgen.checkout.service;

import com.nextgen.checkout.model.Venda;
import com.nextgen.checkout.model.ItemVenda;
import com.nextgen.checkout.model.Produto;
import com.nextgen.checkout.repository.VendaRepository;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;

@ApplicationScoped
public class VendaService {

    @Inject
    VendaRepository vendaRepository;

    @Transactional
    public Venda realizarVenda(Venda venda) {
        venda.setDataVenda(LocalDateTime.now());
        Double valorTotalVenda = 0.0;

        for (ItemVenda item : venda.getItens()) {
            // Busca o produto atualizado no banco de dados para garantir integridade
            Produto produto = Produto.findById(item.getProduto().getId());
            if (produto == null) {
                throw new IllegalArgumentException("Produto com ID " + item.getProduto().getId() + " não encontrado.");
            }

            // Regra de Negócio: Validação e Baixa do Estoque
            if (produto.getQuantidadeEstoque() < item.getQuantidade()) {
                throw new IllegalStateException("Estoque insuficiente para o produto: " + produto.getNome());
            }
            
            // Subtrai a quantidade vendida do estoque do produto
            produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - item.getQuantidade());
            produto.persist(); // Atualiza o produto com o novo estoque

            // Vincula o item à venda e calcula os valores da linha
            item.setProduto(produto);
            item.setPrecoUnitario(produto.getPreco());
            item.setSubtotal(produto.getPreco() * item.getQuantidade());
            
            valorTotalVenda += item.getSubtotal();
            venda.adicionarItem(item);
        }

        venda.setValorTotal(valorTotalVenda);
        vendaRepository.persist(venda);
        
        return venda;
    }
}