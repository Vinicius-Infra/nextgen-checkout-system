package com.nextgen.checkout.resource;

import com.nextgen.checkout.dto.VendaResourceDTO;
import com.nextgen.checkout.model.Produto;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.transaction.Transactional;
import java.util.UUID;

@Path("/api/vendas")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class VendaResource {

    @POST
    @Path("/fechar")
    @Transactional
    public Response fecharVenda(VendaResourceDTO dto) {
        if (dto.itens == null || dto.itens.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                           .entity("{\"erro\": \"Carrinho vazio!\"}")
                           .build();
        }

        String numeroCupom = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        StringBuilder htmlCupom = new StringBuilder();
        htmlCupom.append("<div style='width: 280px; font-family: monospace; font-size: 12px;'>");
        htmlCupom.append("<h2 style='text-align: center; margin: 0;'>NEXTGEN CHECKOUT</h2>");
        htmlCupom.append("<p style='text-align: center; margin: 2px;'>CUPOM FISCAL: #" + numeroCupom + "</p>");
        htmlCupom.append("--------------------------------<br>");
        
        double totalGeral = 0.0;
        int itemMapeado = 1;

        for (VendaResourceDTO.ItemCarrinhoDTO itemDto : dto.itens) {
            Produto produto = Produto.findById(itemDto.produtoId);
            
            if (produto == null) {
                return Response.status(Response.Status.NOT_FOUND)
                               .entity(String.format("{\"erro\": \"Produto com ID %%d não encontrado!\"}", itemDto.produtoId))
                               .build();
            }

            // --- NOVA VALIDAÇÃO E BAIXA DE ESTOQUE ---
            try {
                produto.diminuirEstoque(itemDto.quantidade);
            } catch (IllegalArgumentException e) {
                // Monta o JSON concatenando diretamente a mensagem da exceção
                return Response.status(Response.Status.BAD_REQUEST)
                               .entity("{\"erro\": \"" + e.getMessage() + "\"}")
                               .build();
            }
            // ----------------------------------------
            
            // Se o preço for nulo, joga ZERO com precisão de BigDecimal, senão pega o preço real
            java.math.BigDecimal precoUnitario = produto.preco != null ? produto.preco : java.math.BigDecimal.ZERO;
            
            // Em BigDecimal, multiplicamos usando .multiply() e convertendo o multiplicador
            java.math.BigDecimal subTotalBD = precoUnitario.multiply(java.math.BigDecimal.valueOf(itemDto.quantidade));
            
            // Acumula o subtotal convertido para double no totalGeral que vai pro HTML
            totalGeral += subTotalBD.doubleValue();
            
            // Montando o cupom com os campos diretos e convertidos
            htmlCupom.append(String.format("%02d. %s<br>", itemMapeado++, produto.nome));
            htmlCupom.append(String.format("    %d un x R$ %.2f = R$ %.2f<br>", 
                itemDto.quantidade, precoUnitario.doubleValue(), subTotalBD.doubleValue()));
        }

        htmlCupom.append("--------------------------------<br>");
        htmlCupom.append(String.format("<b style='font-size: 14px;'>TOTAL: R$ %.2f</b><br>", totalGeral));
        htmlCupom.append("</div>");

        String jsonResposta = String.format("{\"mensagem\": \"Venda finalizada!\", \"cupomHtml\": \"%s\"}", 
            htmlCupom.toString().replace("\"", "\\\""));

        return Response.ok(jsonResposta).build();
    }
}