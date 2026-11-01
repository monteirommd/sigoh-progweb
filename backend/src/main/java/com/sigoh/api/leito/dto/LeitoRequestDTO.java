package com.sigoh.api.leito.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record LeitoRequestDTO(

        @NotBlank(message = "Campo obrigatorio") @Size(max = 20, message = "Valor máximo 20 caracteres") String codigo,

        @NotNull(message = "Campo obrigatorio") Long enfermariaId) {
}
