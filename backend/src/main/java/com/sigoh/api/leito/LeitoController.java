package com.sigoh.api.leito;

import java.net.URI;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.sigoh.api.leito.dto.LeitoRequestDTO;
import com.sigoh.api.leito.dto.LeitoResponseDTO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/leitos")
public class LeitoController {

    private final LeitoService service;

    public LeitoController(LeitoService service) {
        this.service = service;
    }

    @GetMapping
    public List<LeitoResponseDTO> listar(
            @RequestParam(required = false) Long blocoId,
            @RequestParam(required = false) Long enfermariaId) {
        return service.listar(blocoId, enfermariaId);
    }

    @GetMapping("/{id}")
    public LeitoResponseDTO buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<LeitoResponseDTO> criar(@Valid @RequestBody LeitoRequestDTO dto) {
        LeitoResponseDTO criado = service.criar(dto);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(criado.id())
                .toUri();
        return ResponseEntity.created(location).body(criado);
    }

    @PutMapping("/{id}")
    public LeitoResponseDTO atualizar(@PathVariable Long id, @Valid @RequestBody LeitoRequestDTO dto) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}
