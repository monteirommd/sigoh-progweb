package com.sigoh.api.enfermaria;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sigoh.api.bloco.Bloco;
import com.sigoh.api.bloco.BlocoRepository;
import com.sigoh.api.common.exception.BusinessException;
import com.sigoh.api.common.exception.ResourceNotFoundException;
import com.sigoh.api.enfermaria.dto.EnfermariaRequestDTO;
import com.sigoh.api.enfermaria.dto.EnfermariaResponseDTO;
import com.sigoh.api.leito.LeitoRepository;

@Service
public class EnfermariaService {

    private static final Sort ORDEM_PADRAO = Sort.by("bloco.nome", "nome");

    private final EnfermariaRepository repository;
    private final BlocoRepository blocoRepository;
    private final LeitoRepository leitoRepository;
    private final EnfermariaMapper mapper;

    public EnfermariaService(EnfermariaRepository repository, BlocoRepository blocoRepository,
            LeitoRepository leitoRepository, EnfermariaMapper mapper) {
        this.repository = repository;
        this.blocoRepository = blocoRepository;
        this.leitoRepository = leitoRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<EnfermariaResponseDTO> listar(Long blocoId) {
        List<Enfermaria> enfermarias = (blocoId == null)
                ? repository.findAllBy(ORDEM_PADRAO)
                : repository.findByBlocoId(blocoId, ORDEM_PADRAO);
        return enfermarias.stream().map(mapper::paraResposta).toList();
    }

    @Transactional(readOnly = true)
    public EnfermariaResponseDTO buscarPorId(Long id) {
        return mapper.paraResposta(buscarEntidade(id));
    }

    @Transactional
    public EnfermariaResponseDTO criar(EnfermariaRequestDTO dto) {
        Bloco bloco = buscarBloco(dto.blocoId());
        String nome = dto.nome().trim();
        if (repository.existsByBlocoIdAndNomeIgnoreCase(bloco.getId(), nome)) {
            throw new BusinessException("Já existe uma enfermaria com o nome '" + nome + "' neste bloco");
        }
        Enfermaria salva = repository.save(mapper.paraEntidade(dto, bloco));
        return mapper.paraResposta(salva);
    }

    @Transactional
    public EnfermariaResponseDTO atualizar(Long id, EnfermariaRequestDTO dto) {
        Enfermaria enfermaria = buscarEntidade(id);
        Bloco bloco = buscarBloco(dto.blocoId());
        String nome = dto.nome().trim();
        if (repository.existsByBlocoIdAndNomeIgnoreCaseAndIdNot(bloco.getId(), nome, id)) {
            throw new BusinessException("Já existe uma enfermaria com o nome '" + nome + "' neste bloco");
        }
        mapper.aplicar(dto, bloco, enfermaria);
        return mapper.paraResposta(enfermaria);
    }

    @Transactional
    public void excluir(Long id) {
        Enfermaria enfermaria = buscarEntidade(id);
        if (leitoRepository.existsByEnfermariaId(id)) {
            throw new BusinessException("Enfermaria possui leitos vinculados e não pode ser excluída");
        }
        repository.delete(enfermaria);
    }

    private Enfermaria buscarEntidade(Long id) {
        return repository.findComBlocoById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enfermaria " + id + " não encontrada"));
    }

    private Bloco buscarBloco(Long blocoId) {
        return blocoRepository.findById(blocoId)
                .orElseThrow(() -> new ResourceNotFoundException("Bloco " + blocoId + " não encontrado"));
    }
}
