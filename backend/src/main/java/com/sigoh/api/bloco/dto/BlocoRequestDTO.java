package com.sigoh.api.bloco.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BlocoRequestDTO (
    @NotBlank(message = "Campo obrigatorio")
    @Size(max = 120, message = "Valor máximo 120 caracteres")
    String nome,
    
    @Size(max = 255, message = "Valor máximo de 255 caracteres")
        String descricao) {
            
}

