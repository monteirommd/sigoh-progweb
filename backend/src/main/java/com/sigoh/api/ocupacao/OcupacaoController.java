package com.sigoh.api.ocupacao;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sigoh.api.ocupacao.dto.OcupacaoBlocoDTO;

@RestController
@RequestMapping("/api/ocupacao")
public class OcupacaoController {

    private final OcupacaoService service;

    public OcupacaoController(OcupacaoService service) {
        this.service = service;
    }

    @GetMapping("/blocos")
    public List<OcupacaoBlocoDTO> porBloco() {
        return service.porBloco();
    }
}
