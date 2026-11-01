package com.sigoh.api.leito.dto;

import com.sigoh.api.leito.StatusLeito;

import jakarta.validation.constraints.NotNull;

public record StatusLeitoRequestDTO(

        @NotNull(message = "Campo obrigatorio")
        StatusLeito status) {
}
