package com.sigoh.api.enfermaria;

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

import com.sigoh.api.enfermaria.dto.EnfermariaRequestDTO;
import com.sigoh.api.enfermaria.dto.EnfermariaResponseDTO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/enfermarias")
public class EnfermariaController {

    private final EnfermariaService service;

    public EnfermariaController(EnfermariaService service) {
        this.service = service;
    }

    @GetMapping
    public List<EnfermariaResponseDTO> listar(@RequestParam(required = false) Long blocoId) {
        return service.listar(blocoId);
    }

    @GetMapping("/{id}")
    public EnfermariaResponseDTO buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<EnfermariaResponseDTO> criar(@Valid @RequestBody EnfermariaRequestDTO dto) {
        EnfermariaResponseDTO criada = service.criar(dto);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(criada.id())
                .toUri();
        return ResponseEntity.created(location).body(criada);
    }

    @PutMapping("/{id}")
    public EnfermariaResponseDTO atualizar(@PathVariable Long id, @Valid @RequestBody EnfermariaRequestDTO dto) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}
