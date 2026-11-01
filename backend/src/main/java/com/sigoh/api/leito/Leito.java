package com.sigoh.api.leito;

import java.time.Instant;

import com.sigoh.api.enfermaria.Enfermaria;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "leito")
@Getter
@Setter
@NoArgsConstructor
public class Leito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String codigo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "enfermaria_id", nullable = false)
    private Enfermaria enfermaria;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusLeito status = StatusLeito.DISPONIVEL;

    @Column(nullable = false)
    private boolean ativo = true;

    @Column(name = "atualizado_em", nullable = false)
    private Instant atualizadoEm;

    @PrePersist
    void marcarCriacao() {
        atualizadoEm = Instant.now();
    }
}
