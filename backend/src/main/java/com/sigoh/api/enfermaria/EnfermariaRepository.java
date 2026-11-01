package com.sigoh.api.enfermaria;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnfermariaRepository extends JpaRepository<Enfermaria, Long> {
    @EntityGraph(attributePaths = "bloco")
    List<Enfermaria> findAllBy(Sort sort);

    @EntityGraph(attributePaths = "bloco")
    List<Enfermaria> findByBlocoId(Long blocoId, Sort sort);

    @EntityGraph(attributePaths = "bloco")
    Optional<Enfermaria> findComBlocoById(Long id);

    boolean existsByBlocoIdAndNomeIgnoreCase(Long blocoId, String nome);

    boolean existsByBlocoIdAndNomeIgnoreCaseAndIdNot(Long blocoId, String nome, Long id);

    boolean existsByBlocoId(Long blocoId);
}
