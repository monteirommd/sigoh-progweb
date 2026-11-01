package com.sigoh.api.auth;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sigoh.api.auth.dto.LoginRequestDTO;
import com.sigoh.api.auth.dto.LoginResponseDTO;
import com.sigoh.api.common.exception.CredenciaisInvalidasException;
import com.sigoh.api.usuario.Usuario;
import com.sigoh.api.usuario.UsuarioRepository;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, TokenService tokenService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    @Transactional(readOnly = true)
    public LoginResponseDTO login(LoginRequestDTO dto) {
        Usuario usuario = usuarioRepository.findByEmailIgnoreCaseAndAtivoTrue(dto.email().trim())
                .orElseThrow(CredenciaisInvalidasException::new);
        if (!passwordEncoder.matches(dto.senha(), usuario.getSenhaHash())) {
            throw new CredenciaisInvalidasException();
        }
        String token = tokenService.gerar(usuario);
        return new LoginResponseDTO(token, usuario.getId(), usuario.getNome(), usuario.getRole());
    }
}
