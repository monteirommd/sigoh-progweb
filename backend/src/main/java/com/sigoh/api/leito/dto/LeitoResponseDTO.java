package com.sigoh.api.leito.dto;

import java.time.Instant;

import com.sigoh.api.leito.StatusLeito;

public record LeitoResponseDTO(
        Long id,
        String codigo,
        StatusLeito status,
        Long enfermariaId,
        String enfermariaNome,
        Long blocoId,
        String blocoNome,
        Instant atualizadoEm,
        String atualizadoPorNome) {
}
