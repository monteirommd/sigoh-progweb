package com.sigoh.api.usuario;

import org.springframework.stereotype.Component;

import com.sigoh.api.usuario.dto.UsuarioRequestDTO;
import com.sigoh.api.usuario.dto.UsuarioResponseDTO;

@Component
public class UsuarioMapper {

    public UsuarioResponseDTO paraResposta(Usuario usuario) {
        return new UsuarioResponseDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getRole(),
                usuario.getCriadoEm());
    }

    public void aplicar(UsuarioRequestDTO dto, Usuario usuario) {
        usuario.setNome(dto.nome().trim());
        usuario.setEmail(dto.email().trim().toLowerCase());
        usuario.setRole(dto.role());
    }
}
