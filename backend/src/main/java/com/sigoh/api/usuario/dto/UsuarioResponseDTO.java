package com.sigoh.api.usuario.dto;

import java.time.Instant;

import com.sigoh.api.usuario.Role;

public record UsuarioResponseDTO(
        Long id,
        String nome,
        String email,
        Role role,
        Instant criadoEm) {
}
