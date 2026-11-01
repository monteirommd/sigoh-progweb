package com.sigoh.api.historico;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HistoricoLeitoRepository extends JpaRepository<HistoricoLeito, Long> {

    @EntityGraph(attributePaths = "usuario")
    List<HistoricoLeito> findByLeitoIdOrderByRegistradoEmDesc(Long leitoId);
}
