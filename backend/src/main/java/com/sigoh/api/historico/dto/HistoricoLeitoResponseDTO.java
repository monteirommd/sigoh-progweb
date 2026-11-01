package com.sigoh.api.historico.dto;

import java.time.Instant;

import com.sigoh.api.leito.StatusLeito;

public record HistoricoLeitoResponseDTO(
        Long id,
        StatusLeito statusAnterior,
        StatusLeito statusNovo,
        String usuarioNome,
        Instant registradoEm) {
}
