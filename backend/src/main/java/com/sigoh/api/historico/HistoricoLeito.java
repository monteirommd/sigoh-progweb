package com.sigoh.api.historico;

import java.time.Instant;

import com.sigoh.api.leito.Leito;
import com.sigoh.api.leito.StatusLeito;
import com.sigoh.api.usuario.Usuario;

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
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "historico_leito")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class HistoricoLeito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "leito_id", nullable = false, updatable = false)
    private Leito leito;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_anterior", length = 20, updatable = false)
    private StatusLeito statusAnterior;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_novo", nullable = false, length = 20, updatable = false)
    private StatusLeito statusNovo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", updatable = false)
    private Usuario usuario;

    @Column(name = "registrado_em", nullable = false, updatable = false)
    private Instant registradoEm;

    public HistoricoLeito(Leito leito, StatusLeito statusAnterior, StatusLeito statusNovo, Usuario usuario) {
        this.leito = leito;
        this.statusAnterior = statusAnterior;
        this.statusNovo = statusNovo;
        this.usuario = usuario;
        this.registradoEm = Instant.now();
    }
}
