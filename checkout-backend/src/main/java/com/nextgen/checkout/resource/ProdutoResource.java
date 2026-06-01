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
        // Busca o produto usando os recursos do Panache Entity/Repository
        Produto produto = Produto.find("codigo_barras", codigoBarras).firstResult();
        
        if (produto == null) {
            // Retorna 404 caso o operador bipe algo não cadastrado
            return Response.status(Response.Status.NOT_FOUND)
                           .entity("{\"erro\": \"Produto não cadastrado!\"}")
                           .build();
        }
        
        return Response.ok(produto).build();
    }

    @POST
    @Transactional 
    public Response criar(@Valid Produto produto) {
        if (Produto.find("codigoBarras", produto.codigoBarras).firstResult() != null) {
            return Response.status(Response.Status.CONFLICT)
                    .entity("{\"error\": \"Já existe um produto cadastrado com este código de barras\"}")
                    .build();
        }

        produto.persist();
        return Response.status(Response.Status.CREATED).entity(produto).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Produto atualizar(@PathParam("id") Long id, @Valid Produto produtoAtualizado) {
        Produto entity = (Produto) Produto.findById(id);
        if (entity == null) {
            throw new WebApplicationException("Produto não encontrado", Response.Status.NOT_FOUND);
        }

        if (!entity.codigoBarras.equals(produtoAtualizado.codigoBarras) && 
            Produto.find("codigoBarras", produtoAtualizado.codigoBarras).firstResult() != null) {
            throw new WebApplicationException("Código de barras já cadastrado em outro produto", Response.Status.CONFLICT);
        }

        entity.nome = produtoAtualizado.nome;
        entity.codigoBarras = produtoAtualizado.codigoBarras;
        entity.preco = produtoAtualizado.preco;
        entity.quantidadeEstoque = produtoAtualizado.quantidadeEstoque;

        return entity;
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