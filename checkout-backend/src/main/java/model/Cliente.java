package com.nextgen.checkout.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_cliente")
public class Cliente extends PanacheEntity {

    @NotBlank(message = "O nome do cliente é obrigatório")
    @Column(nullable = false, length = 150)
    public String nome;

    @NotBlank(message = "O CPF é obrigatório")
    /* * Expressão regular (Regex) para validar o formato do CPF:
     * Aceita tanto o formato puro (11 dígitos) quanto o mascarado (000.000.000-00)
     */
    @Pattern(
        regexp = "(^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$)|(^\\d{11}$)", 
        message = "O CPF deve estar no formato 000.000.000-00 ou conter apenas 11 números"
    )
    @Column(nullable = false, unique = true, length = 14)
    public String cpf;

    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "O e-mail informado deve ser válido")
    @Column(nullable = false, unique = true, length = 100)
    public String email;

    @Column(name = "data_cadastro", nullable = false, updatable = false)
    public LocalDateTime dataCadastro = LocalDateTime.now();

    
}
