package com.sigoh.api.bloco;

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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.sigoh.api.bloco.dto.BlocoRequestDTO;
import com.sigoh.api.bloco.dto.BlocoResponseDTO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/blocos")
public class BlocoController {
    private final BlocoService service;

    public BlocoController(BlocoService service) {
        this.service = service;
    }

    @GetMapping
    public List<BlocoResponseDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public BlocoResponseDTO buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<BlocoResponseDTO> criar(@Valid @RequestBody BlocoRequestDTO dto) {
        BlocoResponseDTO criado = service.criar(dto);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(criado.id())
                .toUri();
        return ResponseEntity.created(location).body(criado);
    }

    @PutMapping("/{id}")
    public BlocoResponseDTO atualizar(@PathVariable Long id, @Valid @RequestBody BlocoRequestDTO dto) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}
