package com.sigoh.api.leito;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeitoRepository extends JpaRepository<Leito, Long> {

    @EntityGraph(attributePaths = { "enfermaria", "enfermaria.bloco" })
    List<Leito> findByAtivoTrue(Sort sort);

    @EntityGraph(attributePaths = { "enfermaria", "enfermaria.bloco" })
    List<Leito> findByEnfermariaIdAndAtivoTrue(Long enfermariaId, Sort sort);

    @EntityGraph(attributePaths = { "enfermaria", "enfermaria.bloco" })
    List<Leito> findByEnfermariaBlocoIdAndAtivoTrue(Long blocoId, Sort sort);

    @EntityGraph(attributePaths = { "enfermaria", "enfermaria.bloco" })
    Optional<Leito> findByIdAndAtivoTrue(Long id);

    boolean existsByEnfermariaIdAndCodigoIgnoreCaseAndAtivoTrue(Long enfermariaId, String codigo);

    boolean existsByEnfermariaIdAndCodigoIgnoreCaseAndAtivoTrueAndIdNot(Long enfermariaId, String codigo, Long id);

    boolean existsByEnfermariaId(Long enfermariaId);
}
