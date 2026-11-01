package com.sigoh.api.usuario.dto;

import com.sigoh.api.usuario.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UsuarioRequestDTO(

        @NotBlank(message = "Campo obrigatorio")
        @Size(max = 120, message = "Valor máximo 120 caracteres")
        String nome,

        @NotBlank(message = "Campo obrigatorio")
        @Email(message = "E-mail inválido")
        @Size(max = 160, message = "Valor máximo 160 caracteres")
        String email,

        @Size(min = 6, max = 72, message = "Senha deve ter entre 6 e 72 caracteres")
        String senha,

        @NotNull(message = "Campo obrigatorio")
        Role role) {
}
