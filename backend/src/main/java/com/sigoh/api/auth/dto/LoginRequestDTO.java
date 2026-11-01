package com.sigoh.api.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequestDTO(

        @NotBlank(message = "Campo obrigatorio")
        String email,

        @NotBlank(message = "Campo obrigatorio")
        String senha) {
}
