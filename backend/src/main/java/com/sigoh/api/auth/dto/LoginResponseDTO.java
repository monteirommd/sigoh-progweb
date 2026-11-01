package com.sigoh.api.auth.dto;

import com.sigoh.api.usuario.Role;

public record LoginResponseDTO(
        String token,
        Long usuarioId,
        String nome,
        Role role) {
}
