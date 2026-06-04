package com.nextgen.checkout.resource;

import java.util.List;

import com.nextgen.checkout.model.Produto;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/produtos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProdutoResource {

    @GET
    public List<Produto> listarTodos() {
        return Produto.listAll();
    }

    @GET
    @Path("/{id}")
    public Produto buscarPorId(@PathParam("id") Long id) {
        Produto produto = (Produto) Produto.findById(id);
        if (produto == null) {
            throw new WebApplicationException("Produto não encontrado", Response.Status.NOT_FOUND);
        }
        return produto;
    }

    @GET
    @Path("/bipar/{codigoBarras}")
    public Response buscarPorCodigo(@PathParam("codigoBarras") String codigoBarras) {
        Produto produto = Produto.find("codigoBarras", codigoBarras).firstResult();

        if (produto == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"erro\": \"Produto não cadastrado!\"}")
                    .build();
        }

        return Response.ok(produto).build();
    }

    @POST
    @Transactional
    public Response criar(@Valid Produto produto) {
        // 1. Validação preventiva (Ajustado para devolver "erro")
        if (Produto.find("codigoBarras", produto.codigoBarras).firstResult() != null) {
            return Response.status(Response.Status.CONFLICT)
                    .entity("{\"erro\": \"Já existe um produto cadastrado com este código de barras\"}")
                    .build();
        }

        try {
            produto.persist();
            return Response.status(Response.Status.CREATED).entity(produto).build();
        } catch (jakarta.persistence.PersistenceException e) {
            // 2. Segunda camada de proteção (Garantia do Banco de Dados)
            return Response.status(Response.Status.CONFLICT)
                    .entity("{\"erro\": \"Já existe um produto cadastrado com este código de barras\"}")
                    .build();
        }
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response atualizar(@PathParam("id") Long id, @Valid Produto produtoAtualizado) {
        Produto entity = (Produto) Produto.findById(id);
        if (entity == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"erro\": \"Produto não encontrado\"}")
                    .build();
        }

        // Ajustado para checar duplicidade com o JSON padronizado
        if (!entity.codigoBarras.equals(produtoAtualizado.codigoBarras) &&
                Produto.find("codigoBarras", produtoAtualizado.codigoBarras).firstResult() != null) {
            return Response.status(Response.Status.CONFLICT)
                    .entity("{\"erro\": \"Código de barras já cadastrado em outro produto\"}")
                    .build();
        }

        entity.nome = produtoAtualizado.nome;
        entity.codigoBarras = produtoAtualizado.codigoBarras;
        entity.preco = produtoAtualizado.preco;
        entity.quantidadeEstoque = produtoAtualizado.quantidadeEstoque;

        return Response.ok(entity).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response deletar(@PathParam("id") Long id) {
        Produto entity = (Produto) Produto.findById(id);
        if (entity == null) {
            throw new WebApplicationException("Produto não encontrado", Response.Status.NOT_FOUND);
        }

        entity.delete();
        return Response.status(Response.Status.NO_CONTENT).build();
    }
}