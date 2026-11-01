package com.sigoh.api.ocupacao.dto;

public record OcupacaoBlocoDTO(
        Long blocoId,
        String blocoNome,
        long total,
        long disponiveis,
        long ocupados,
        long limpeza,
        long bloqueados,
        double taxaOcupacao) {
}
