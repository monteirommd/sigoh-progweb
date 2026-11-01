package com.sigoh.api.bloco;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sigoh.api.bloco.dto.BlocoRequestDTO;
import com.sigoh.api.bloco.dto.BlocoResponseDTO;
import com.sigoh.api.common.exception.BusinessException;
import com.sigoh.api.common.exception.ResourceNotFoundException;
import com.sigoh.api.enfermaria.EnfermariaRepository;

@Service
public class BlocoService {
    private final BlocoRepository repository;
    private final EnfermariaRepository enfermariaRepository;
    private final BlocoMapper mapper;

    public BlocoService(BlocoRepository repository, EnfermariaRepository enfermariaRepository, BlocoMapper mapper) {
        this.repository = repository;
        this.enfermariaRepository = enfermariaRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<BlocoResponseDTO> listar() {
        return repository.findAll(Sort.by("nome")).stream().map(mapper::paraResposta).toList();
    }

    @Transactional(readOnly = true)
    public BlocoResponseDTO buscarPorId(Long id) {
        return mapper.paraResposta(buscarEntidade(id));
    }

    @Transactional
    public BlocoResponseDTO criar(BlocoRequestDTO dto) {
        String nome = dto.nome().trim();
        if (repository.existsByNomeIgnoreCase(nome)) {
            throw new BusinessException("Já existe um bloco com o nome '" + nome + "'");
        }
        Bloco salvo = repository.save(mapper.paraEntidade(dto));
        return mapper.paraResposta(salvo);
    }

    @Transactional
    public BlocoResponseDTO atualizar(Long id, BlocoRequestDTO dto) {
        Bloco bloco = buscarEntidade(id);
        String nome = dto.nome().trim();
        if (repository.existsByNomeIgnoreCaseAndIdNot(nome, id)) {
            throw new BusinessException("Já existe um bloco com o nome '" + nome + "'");
        }
        mapper.aplicar(dto, bloco);
        return mapper.paraResposta(bloco);
    }

    @Transactional
    public void excluir(Long id) {
        Bloco bloco = buscarEntidade(id);
        if (enfermariaRepository.existsByBlocoId(id)) {
            throw new BusinessException("Bloco possui enfermarias vinculadas e não pode ser excluído");
        }
        repository.delete(bloco);
    }

    private Bloco buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bloco " + id + " não encontrado"));
    }
}
