package com.nextgen.checkout.dto;

import java.util.List;

public class VendaDTO {

    public List<ItemCarrinhoDTO> itens;

    public static class ItemCarrinhoDTO {
        public Long produtoId;
        public Integer quantidade;
    }
    
}
