package com.sigoh.api.leito;

import java.time.Instant;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sigoh.api.common.exception.BusinessException;
import com.sigoh.api.common.exception.ResourceNotFoundException;
import com.sigoh.api.enfermaria.Enfermaria;
import com.sigoh.api.enfermaria.EnfermariaRepository;
import com.sigoh.api.historico.HistoricoLeito;
import com.sigoh.api.historico.HistoricoLeitoRepository;
import com.sigoh.api.historico.dto.HistoricoLeitoResponseDTO;
import com.sigoh.api.leito.dto.LeitoRequestDTO;
import com.sigoh.api.leito.dto.LeitoResponseDTO;
import com.sigoh.api.leito.dto.StatusLeitoRequestDTO;
import com.sigoh.api.usuario.Usuario;
import com.sigoh.api.usuario.UsuarioRepository;

@Service
public class LeitoService {

    private static final Sort ORDEM_PADRAO = Sort.by("enfermaria.bloco.nome", "enfermaria.nome", "codigo");

    private final LeitoRepository repository;
    private final EnfermariaRepository enfermariaRepository;
    private final HistoricoLeitoRepository historicoRepository;
    private final UsuarioRepository usuarioRepository;
    private final LeitoMapper mapper;

    public LeitoService(LeitoRepository repository, EnfermariaRepository enfermariaRepository,
            HistoricoLeitoRepository historicoRepository, UsuarioRepository usuarioRepository, LeitoMapper mapper) {
        this.repository = repository;
        this.enfermariaRepository = enfermariaRepository;
        this.historicoRepository = historicoRepository;
        this.usuarioRepository = usuarioRepository;
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

    @Transactional
    public LeitoResponseDTO alterarStatus(Long id, StatusLeitoRequestDTO dto, Long usuarioId) {
        Leito leito = buscarEntidade(id);
        StatusLeito anterior = leito.getStatus();
        if (anterior == dto.status()) {
            throw new BusinessException("O leito já está com o status " + dto.status());
        }
        Usuario usuario = usuarioRepository.getReferenceById(usuarioId);
        leito.setStatus(dto.status());
        leito.setAtualizadoEm(Instant.now());
        leito.setAtualizadoPor(usuario);
        historicoRepository.save(new HistoricoLeito(leito, anterior, dto.status(), usuario));
        return mapper.paraResposta(leito);
    }

    @Transactional(readOnly = true)
    public List<HistoricoLeitoResponseDTO> listarHistorico(Long id) {
        buscarEntidade(id);
        return historicoRepository.findByLeitoIdOrderByRegistradoEmDesc(id).stream()
                .map(mapper::paraHistorico)
                .toList();
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
