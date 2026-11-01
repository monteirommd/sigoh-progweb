package com.sigoh.api.enfermaria;

import org.springframework.stereotype.Component;

import com.sigoh.api.bloco.Bloco;
import com.sigoh.api.enfermaria.dto.EnfermariaRequestDTO;
import com.sigoh.api.enfermaria.dto.EnfermariaResponseDTO;

@Component
public class EnfermariaMapper {

    public EnfermariaResponseDTO paraResposta(Enfermaria enfermaria) {
        Bloco bloco = enfermaria.getBloco();
        return new EnfermariaResponseDTO(
                enfermaria.getId(),
                enfermaria.getNome(),
                enfermaria.getDescricao(),
                bloco.getId(),
                bloco.getNome());
    }

    public Enfermaria paraEntidade(EnfermariaRequestDTO dto, Bloco bloco) {
        Enfermaria enfermaria = new Enfermaria();
        aplicar(dto, bloco, enfermaria);
        return enfermaria;
    }

    public void aplicar(EnfermariaRequestDTO dto, Bloco bloco, Enfermaria enfermaria) {
        enfermaria.setNome(dto.nome().trim());
        enfermaria.setDescricao(textoOuNulo(dto.descricao()));
        enfermaria.setBloco(bloco);
    }

    private String textoOuNulo(String texto) {
        return (texto == null || texto.isBlank()) ? null : texto.trim();
    }
}
