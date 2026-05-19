package com.nextgen.checkout.resource;

import com.nextgen.checkout.model.Cliente;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api/clientes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ClienteResource {

    @GET
    public List<Cliente> listarTodos() {
        return Cliente.listAll();
    }

    @POST
    @Transactional
    public Response criar(@Valid Cliente cliente) {
        // Regra de Negócio: Impede CPFs duplicados no checkout
        if (Cliente.find("cpf", cliente.cpf).firstResult() != null) {
            return Response.status(Response.Status.CONFLICT)
                    .entity("{\"error\": \"Já existe um cliente cadastrado com este CPF\"}")
                    .build();
        }

        // Regra de Negócio: Impede E-mails duplicados
        if (Cliente.find("email", cliente.email).firstResult() != null) {
            return Response.status(Response.Status.CONFLICT)
                    .entity("{\"error\": \"Já existe um cliente cadastrado com este e-mail\"}")
                    .build();
        }

        cliente.persist();
        return Response.status(Response.Status.CREATED).entity(cliente).build();
    }
}