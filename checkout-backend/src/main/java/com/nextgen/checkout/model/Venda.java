package com.nextgen.checkout.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vendas")
public class Venda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_venda", nullable = false)
    private LocalDateTime dataVenda;

    @Column(name = "valor_total", nullable = false)
    private Double valorTotal;

    // Relacionamento 1-para-Muitos: Uma venda tem vários itens no cupom
    @OneToMany(mappedBy = "venda", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ItemVenda> itens = new ArrayList<>();

    // Construtor padrão exigido pelo Hibernate
    public Venda() {
        this.dataVenda = LocalDateTime.now();
    }

    // Método utilitário para adicionar itens garantindo o vínculo dos dois lados
    public void adicionarItem(ItemVenda item) {
        this.itens.add(item);
        item.setVenda(this);
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getDataVenda() { return dataVenda; }
    public void setDataVenda(LocalDateTime dataVenda) { this.dataVenda = dataVenda; }

    public Double getValorTotal() { return valorTotal; }
    public void setValorTotal(Double valorTotal) { this.valorTotal = valorTotal; }

    public List<ItemVenda> getItens() { return itens; }
    public void setItens(List<ItemVenda> itens) { this.itens = itens; }
}