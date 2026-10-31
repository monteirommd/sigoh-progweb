CREATE TABLE usuario(
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL,
    senha_hash VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_usuario_email UNIQUE(email),
    CONSTRAINT ck_usuario_role CHECK (role IN ('ADMIN', 'GESTAO', 'TECNICO', 'VISITANTE'))
);


CREATE TABLE bloco(
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    descricao VARCHAR(255),
    CONSTRAINT uq_bloco_nome UNIQUE(nome)
);

CREATE TABLE enfermaria(
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    descricao VARCHAR(255),
    bloco_id BIGINT NOT NULL REFERENCES bloco (id) ON DELETE RESTRICT,
    CONSTRAINT uq_enfermaria_bloco_nome UNIQUE(nome, bloco_id)
);
CREATE INDEX idx_enfermaria_bloco_id ON enfermaria (bloco_id);

CREATE TABLE leito(
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL,
    enfermaria_id BIGINT NOT NULL REFERENCES enfermaria (id) ON DELETE RESTRICT,
    status VARCHAR(20) NOT NULL DEFAULT 'DISPONIVEL',
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_por_id BIGINT REFERENCES usuario (id),
    CONSTRAINT ck_leito_status CHECK (status IN ('DISPONIVEL', 'OCUPADO', 'LIMPEZA', 'BLOQUEADO'))
);
CREATE INDEX idx_leito_enfermaria ON leito (enfermaria_id);
CREATE INDEX idx_leito_status ON leito (status);

CREATE UNIQUE INDEX uq_leito_enfermaria_codigo_ativo
    ON leito (enfermaria_id, codigo) WHERE ativo = TRUE;

CREATE TABLE historico_leito(
    id BIGSERIAL PRIMARY KEY,
    leito_id BIGINT NOT NULL REFERENCES leito (id) ON DELETE RESTRICT,
    status_anterior VARCHAR(20),
    status_novo VARCHAR(20) NOT NULL,
    usuario_id BIGINT REFERENCES usuario (id),
    registrado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_hist_status_anterior
        CHECK (status_anterior IS NULL
            OR status_anterior IN ('DISPONIVEL', 'OCUPADO', 'LIMPEZA', 'BLOQUEADO')),
    CONSTRAINT ck_hist_status_novo
        CHECK (status_novo IN ('DISPONIVEL', 'OCUPADO', 'LIMPEZA', 'BLOQUEADO'))
);
CREATE INDEX idx_hist_leito_data ON historico_leito (leito_id, registrado_em DESC);
