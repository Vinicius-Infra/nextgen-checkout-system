package com.nextgen.checkout.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

@Entity
@Table(name = "tb_produto")
public class Produto extends PanacheEntity {

    @NotBlank(message = "O nome do produto é obrigatório")
    @Column(nullable = false, length = 150)
    public String nome;

    @NotBlank(message = "O código de barras é obrigatório")
    @Column(name = "codigo_barras", nullable = false, unique = true, length = 50)
    public String codigoBarras;

    @NotNull(message = "O preço é obrigatório")
    @PositiveOrZero(message = "O preço não pode ser negativo")
    @Column(nullable = false, precision = 10, scale = 2)
    public BigDecimal preco;

    @NotNull(message = "A quantidade em estoque é obrigatória")
    @PositiveOrZero(message = "A quantidade em estoque não pode ser negativa")
    @Column(nullable = false)
    public Integer quantidadeEstoque;

    public void diminuirEstoque(int quantidadeVendida) {
        if (this.quantidadeEstoque < quantidadeVendida) {
            throw new IllegalArgumentException("Estoque insuficiente para o produto: " + this.nome + 
                " (Disponível: " + this.quantidadeEstoque + ", Solicitado: " + quantidadeVendida + ")");
        }
        this.quantidadeEstoque -= quantidadeVendida;
    }

}
