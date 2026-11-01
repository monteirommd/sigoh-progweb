package com.sigoh.api.enfermaria.dto;

public record EnfermariaResponseDTO(
        Long id,
        String nome,
        String descricao,
        Long blocoId,
        String blocoNome) {
}
