package com.sigoh.api.ocupacao;

import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sigoh.api.bloco.Bloco;
import com.sigoh.api.bloco.BlocoRepository;
import com.sigoh.api.leito.LeitoRepository;
import com.sigoh.api.leito.StatusLeito;
import com.sigoh.api.ocupacao.dto.ContagemStatusDTO;
import com.sigoh.api.ocupacao.dto.OcupacaoBlocoDTO;

@Service
public class OcupacaoService {

    private final BlocoRepository blocoRepository;
    private final LeitoRepository leitoRepository;

    public OcupacaoService(BlocoRepository blocoRepository, LeitoRepository leitoRepository) {
        this.blocoRepository = blocoRepository;
        this.leitoRepository = leitoRepository;
    }

    @Transactional(readOnly = true)
    public List<OcupacaoBlocoDTO> porBloco() {
        Map<Long, Map<StatusLeito, Long>> contagens = new HashMap<>();
        for (ContagemStatusDTO c : leitoRepository.contarAtivosPorBlocoEStatus()) {
            contagens.computeIfAbsent(c.blocoId(), id -> new EnumMap<>(StatusLeito.class))
                    .put(c.status(), c.quantidade());
        }
        return blocoRepository.findAll(Sort.by("nome")).stream()
                .map(bloco -> montar(bloco, contagens.getOrDefault(bloco.getId(), Map.of())))
                .toList();
    }

    private OcupacaoBlocoDTO montar(Bloco bloco, Map<StatusLeito, Long> porStatus) {
        long disponiveis = porStatus.getOrDefault(StatusLeito.DISPONIVEL, 0L);
        long ocupados = porStatus.getOrDefault(StatusLeito.OCUPADO, 0L);
        long limpeza = porStatus.getOrDefault(StatusLeito.LIMPEZA, 0L);
        long bloqueados = porStatus.getOrDefault(StatusLeito.BLOQUEADO, 0L);
        long total = disponiveis + ocupados + limpeza + bloqueados;
        return new OcupacaoBlocoDTO(bloco.getId(), bloco.getNome(), total, disponiveis, ocupados, limpeza,
                bloqueados, calcularTaxa(ocupados, total, bloqueados));
    }

    public static double calcularTaxa(long ocupados, long total, long bloqueados) {
        long operacionais = total - bloqueados;
        if (operacionais <= 0) {
            return 0.0;
        }
        return Math.round(ocupados * 1000.0 / operacionais) / 10.0;
    }
}
