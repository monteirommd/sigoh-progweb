package com.sigoh.api.bloco;

import org.springframework.stereotype.Component;

import com.sigoh.api.bloco.dto.BlocoRequestDTO;
import com.sigoh.api.bloco.dto.BlocoResponseDTO;

@Component 
public class BlocoMapper {
    public BlocoResponseDTO paraResposta(Bloco bloco) {
        return new BlocoResponseDTO(bloco.getId(), bloco.getNome(), bloco.getDescricao());
    }

    public Bloco paraEntidade(BlocoRequestDTO dto) {
        Bloco bloco = new Bloco();
        aplicar(dto, bloco);
        return bloco;
    }

    public void aplicar(BlocoRequestDTO dto, Bloco bloco) {
        bloco.setNome(dto.nome().trim());
        bloco.setDescricao(textoOuNulo(dto.descricao()));
    }

    private String textoOuNulo(String texto) {
        return (texto == null || texto.isBlank()) ? null : texto.trim();
    }
}
