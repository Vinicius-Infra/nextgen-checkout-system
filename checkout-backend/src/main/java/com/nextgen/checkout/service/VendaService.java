package com.nextgen.checkout.service;

import com.nextgen.checkout.model.Venda;
import com.nextgen.checkout.model.ItemVenda;
import com.nextgen.checkout.model.Produto;
import com.nextgen.checkout.repository.VendaRepository; 
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@ApplicationScoped
public class VendaService {

    @Inject
    VendaRepository vendaRepository;

    @Transactional
    public Venda realizarVenda(Venda venda) {
        venda.setDataVenda(LocalDateTime.now());
        
        // Mudamos o acumulador para BigDecimal para manter a precisão bancária
        BigDecimal valorTotalVenda = BigDecimal.ZERO;

        for (ItemVenda item : venda.getItens()) {
            // Buscando o produto usando o ID público (Panache)
            Produto produto = Produto.findById(item.getProduto().id);
            if (produto == null) {
                throw new IllegalArgumentException("Produto com ID " + item.getProduto().id + " não encontrado.");
            }

            // Acessando o atributo público quantidadeEstoque diretamente
            if (produto.quantidadeEstoque < item.getQuantidade()) {
                throw new IllegalStateException("Estoque insuficiente para o produto: " + produto.nome);
            }
            
            // Abatendo o estoque acessando e alterando diretamente os atributos públicos
            produto.quantidadeEstoque = produto.quantidadeEstoque - item.getQuantidade();
            produto.persist(); 

            // Tratamento seguro para garantir que o preço não seja nulo
            BigDecimal precoUnitario = produto.preco != null ? produto.preco : BigDecimal.ZERO;
            
            // Calculando o subtotal usando multiplicação nativa do BigDecimal
            BigDecimal subtotalItem = precoUnitario.multiply(BigDecimal.valueOf(item.getQuantidade()));

            item.setProduto(produto);
            // Se as suas entidades ItemVenda usam Double ou BigDecimal, fazemos a conversão aqui
            item.setPrecoUnitario(precoUnitario.doubleValue());
            item.setSubtotal(subtotalItem.doubleValue());
            
            // Acumulando no total geral da venda
            valorTotalVenda = valorTotalVenda.add(subtotalItem);
            venda.adicionarItem(item);
        }

        venda.setValorTotal(valorTotalVenda.doubleValue());
        vendaRepository.persist(venda);
        
        return venda;
    }
}