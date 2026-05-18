package com.nextgen.checkout.resource;

import com.nextgen.checkout.model.Produto;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;


@Path("/api/produtos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProdutoResource {

    @GET
    public List<Produto> listarTodos() {
        // O Panache traz o método listAll() nativo da própria entidade!
        return Produto.listAll();
    }

    @POST
    @Transactional // CRUCIAL: Abre uma transação com o banco para persistir os dados
    public Response criar(@Valid Produto produto) {
        // Valida se o código de barras já existe para evitar erro de constraint pesado
        if (Produto.find("codigoBarras", produto.codigoBarras).firstResult() != null) {
            return Response.status(Response.Status.CONFLICT)
                    .entity("{\"error\": \"Já existe um produto cadastrado com este código de barras\"}")
                    .build();
        }

        // Salva o produto no banco de dados
        produto.persist();
        
        // Retorna o produto salvo com o ID gerado e o status 201 (Created)
        return Response.status(Response.Status.CREATED).entity(produto).build();
    }
    
}
