package com.sigoh.api.leito;

import org.springframework.stereotype.Component;

import com.sigoh.api.bloco.Bloco;
import com.sigoh.api.enfermaria.Enfermaria;
import com.sigoh.api.leito.dto.LeitoRequestDTO;
import com.sigoh.api.leito.dto.LeitoResponseDTO;

@Component
public class LeitoMapper {

    public LeitoResponseDTO paraResposta(Leito leito) {
        Enfermaria enfermaria = leito.getEnfermaria();
        Bloco bloco = enfermaria.getBloco();
        return new LeitoResponseDTO(
                leito.getId(),
                leito.getCodigo(),
                leito.getStatus(),
                enfermaria.getId(),
                enfermaria.getNome(),
                bloco.getId(),
                bloco.getNome(),
                leito.getAtualizadoEm());
    }

    public Leito paraEntidade(LeitoRequestDTO dto, Enfermaria enfermaria) {
        Leito leito = new Leito();
        aplicar(dto, enfermaria, leito);
        return leito;
    }

    public void aplicar(LeitoRequestDTO dto, Enfermaria enfermaria, Leito leito) {
        leito.setCodigo(dto.codigo().trim());
        leito.setEnfermaria(enfermaria);
    }
}
