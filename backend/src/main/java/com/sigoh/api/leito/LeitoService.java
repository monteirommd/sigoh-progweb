package com.sigoh.api.leito;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sigoh.api.common.exception.BusinessException;
import com.sigoh.api.common.exception.ResourceNotFoundException;
import com.sigoh.api.enfermaria.Enfermaria;
import com.sigoh.api.enfermaria.EnfermariaRepository;
import com.sigoh.api.leito.dto.LeitoRequestDTO;
import com.sigoh.api.leito.dto.LeitoResponseDTO;

@Service
public class LeitoService {

    private static final Sort ORDEM_PADRAO = Sort.by("enfermaria.bloco.nome", "enfermaria.nome", "codigo");

    private final LeitoRepository repository;
    private final EnfermariaRepository enfermariaRepository;
    private final LeitoMapper mapper;

    public LeitoService(LeitoRepository repository, EnfermariaRepository enfermariaRepository, LeitoMapper mapper) {
        this.repository = repository;
        this.enfermariaRepository = enfermariaRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<LeitoResponseDTO> listar(Long blocoId, Long enfermariaId) {
        List<Leito> leitos;
        if (enfermariaId != null) {
            leitos = repository.findByEnfermariaIdAndAtivoTrue(enfermariaId, ORDEM_PADRAO);
        } else if (blocoId != null) {
            leitos = repository.findByEnfermariaBlocoIdAndAtivoTrue(blocoId, ORDEM_PADRAO);
        } else {
            leitos = repository.findByAtivoTrue(ORDEM_PADRAO);
        }
        return leitos.stream().map(mapper::paraResposta).toList();
    }

    @Transactional(readOnly = true)
    public LeitoResponseDTO buscarPorId(Long id) {
        return mapper.paraResposta(buscarEntidade(id));
    }

    @Transactional
    public LeitoResponseDTO criar(LeitoRequestDTO dto) {
        Enfermaria enfermaria = buscarEnfermaria(dto.enfermariaId());
        String codigo = dto.codigo().trim();
        if (repository.existsByEnfermariaIdAndCodigoIgnoreCaseAndAtivoTrue(enfermaria.getId(), codigo)) {
            throw new BusinessException("Já existe um leito com o código '" + codigo + "' nesta enfermaria");
        }
        Leito salvo = repository.save(mapper.paraEntidade(dto, enfermaria));
        return mapper.paraResposta(salvo);
    }

    @Transactional
    public LeitoResponseDTO atualizar(Long id, LeitoRequestDTO dto) {
        Leito leito = buscarEntidade(id);
        Enfermaria enfermaria = buscarEnfermaria(dto.enfermariaId());
        String codigo = dto.codigo().trim();
        if (repository.existsByEnfermariaIdAndCodigoIgnoreCaseAndAtivoTrueAndIdNot(enfermaria.getId(), codigo, id)) {
            throw new BusinessException("Já existe um leito com o código '" + codigo + "' nesta enfermaria");
        }
        mapper.aplicar(dto, enfermaria, leito);
        return mapper.paraResposta(leito);
    }

    @Transactional
    public void excluir(Long id) {
        Leito leito = buscarEntidade(id);
        leito.setAtivo(false);
    }

    private Leito buscarEntidade(Long id) {
        return repository.findByIdAndAtivoTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leito " + id + " não encontrado"));
    }

    private Enfermaria buscarEnfermaria(Long enfermariaId) {
        return enfermariaRepository.findComBlocoById(enfermariaId)
                .orElseThrow(() -> new ResourceNotFoundException("Enfermaria " + enfermariaId + " não encontrada"));
    }
}
