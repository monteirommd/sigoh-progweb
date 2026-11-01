package com.sigoh.api.ocupacao.dto;

import com.sigoh.api.leito.StatusLeito;

public record ContagemStatusDTO(
        Long blocoId,
        StatusLeito status,
        Long quantidade) {
}
