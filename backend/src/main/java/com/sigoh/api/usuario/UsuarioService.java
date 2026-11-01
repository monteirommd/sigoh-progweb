package com.sigoh.api.usuario;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sigoh.api.common.exception.BusinessException;
import com.sigoh.api.common.exception.ResourceNotFoundException;
import com.sigoh.api.usuario.dto.UsuarioRequestDTO;
import com.sigoh.api.usuario.dto.UsuarioResponseDTO;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    private final UsuarioMapper mapper;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository repository, UsuarioMapper mapper, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.mapper = mapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> listar() {
        return repository.findByAtivoTrue(Sort.by("nome")).stream()
                .map(mapper::paraResposta)
                .toList();
    }

    @Transactional(readOnly = true)
    public UsuarioResponseDTO buscarPorId(Long id) {
        return mapper.paraResposta(buscarEntidade(id));
    }

    @Transactional
    public UsuarioResponseDTO criar(UsuarioRequestDTO dto) {
        if (dto.senha() == null || dto.senha().isBlank()) {
            throw new BusinessException("Senha é obrigatória para novo usuário");
        }
        String email = dto.email().trim();
        if (repository.existsByEmailIgnoreCase(email)) {
            throw new BusinessException("Já existe um usuário com o e-mail '" + email + "'");
        }
        Usuario usuario = new Usuario();
        mapper.aplicar(dto, usuario);
        usuario.setSenhaHash(passwordEncoder.encode(dto.senha()));
        return mapper.paraResposta(repository.save(usuario));
    }

    @Transactional
    public UsuarioResponseDTO atualizar(Long id, UsuarioRequestDTO dto) {
        Usuario usuario = buscarEntidade(id);
        String email = dto.email().trim();
        if (repository.existsByEmailIgnoreCaseAndIdNot(email, id)) {
            throw new BusinessException("Já existe um usuário com o e-mail '" + email + "'");
        }
        mapper.aplicar(dto, usuario);
        if (dto.senha() != null && !dto.senha().isBlank()) {
            usuario.setSenhaHash(passwordEncoder.encode(dto.senha()));
        }
        return mapper.paraResposta(usuario);
    }

    @Transactional
    public void excluir(Long id, Long idUsuarioLogado) {
        if (id.equals(idUsuarioLogado)) {
            throw new BusinessException("Você não pode excluir o próprio usuário");
        }
        Usuario usuario = buscarEntidade(id);
        usuario.setAtivo(false);
    }

    private Usuario buscarEntidade(Long id) {
        return repository.findByIdAndAtivoTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário " + id + " não encontrado"));
    }
}
