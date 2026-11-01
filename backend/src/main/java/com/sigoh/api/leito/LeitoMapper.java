package com.sigoh.api.leito;

import org.springframework.stereotype.Component;

import com.sigoh.api.bloco.Bloco;
import com.sigoh.api.enfermaria.Enfermaria;
import com.sigoh.api.historico.HistoricoLeito;
import com.sigoh.api.historico.dto.HistoricoLeitoResponseDTO;
import com.sigoh.api.leito.dto.LeitoRequestDTO;
import com.sigoh.api.leito.dto.LeitoResponseDTO;
import com.sigoh.api.usuario.Usuario;

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
                leito.getAtualizadoEm(),
                nomeOuNulo(leito.getAtualizadoPor()));
    }

    public HistoricoLeitoResponseDTO paraHistorico(HistoricoLeito historico) {
        return new HistoricoLeitoResponseDTO(
                historico.getId(),
                historico.getStatusAnterior(),
                historico.getStatusNovo(),
                nomeOuNulo(historico.getUsuario()),
                historico.getRegistradoEm());
    }

    private String nomeOuNulo(Usuario usuario) {
        return usuario == null ? null : usuario.getNome();
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
