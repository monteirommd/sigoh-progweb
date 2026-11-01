package com.sigoh.api.leito;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.sigoh.api.ocupacao.dto.ContagemStatusDTO;

public interface LeitoRepository extends JpaRepository<Leito, Long> {

    @EntityGraph(attributePaths = { "enfermaria", "enfermaria.bloco", "atualizadoPor" })
    List<Leito> findByAtivoTrue(Sort sort);

    @EntityGraph(attributePaths = { "enfermaria", "enfermaria.bloco", "atualizadoPor" })
    List<Leito> findByEnfermariaIdAndAtivoTrue(Long enfermariaId, Sort sort);

    @EntityGraph(attributePaths = { "enfermaria", "enfermaria.bloco", "atualizadoPor" })
    List<Leito> findByEnfermariaBlocoIdAndAtivoTrue(Long blocoId, Sort sort);

    @EntityGraph(attributePaths = { "enfermaria", "enfermaria.bloco", "atualizadoPor" })
    Optional<Leito> findByIdAndAtivoTrue(Long id);

    boolean existsByEnfermariaIdAndCodigoIgnoreCaseAndAtivoTrue(Long enfermariaId, String codigo);

    boolean existsByEnfermariaIdAndCodigoIgnoreCaseAndAtivoTrueAndIdNot(Long enfermariaId, String codigo, Long id);

    boolean existsByEnfermariaId(Long enfermariaId);

    @Query("""
            SELECT new com.sigoh.api.ocupacao.dto.ContagemStatusDTO(e.bloco.id, l.status, COUNT(l))
            FROM Leito l JOIN l.enfermaria e
            WHERE l.ativo = true
            GROUP BY e.bloco.id, l.status
            """)
    List<ContagemStatusDTO> contarAtivosPorBlocoEStatus();
}
