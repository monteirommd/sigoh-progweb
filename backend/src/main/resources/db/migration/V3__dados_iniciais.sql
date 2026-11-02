INSERT INTO bloco (nome, descricao) VALUES
    ('Bloco A', 'Clínica Médica'),
    ('Bloco B', 'Clínica Cirúrgica'),
    ('Bloco C', 'Materno-Infantil')
ON CONFLICT (nome) DO NOTHING;

INSERT INTO enfermaria (nome, descricao, bloco_id)
SELECT e.nome, e.descricao, b.id
FROM (VALUES
    ('Enfermaria 101', 'Clínica geral adulto',   'Bloco A'),
    ('Enfermaria 102', 'Cardiologia',            'Bloco A'),
    ('Enfermaria 201', 'Pós-operatório',         'Bloco B'),
    ('Enfermaria 202', 'Ortopedia',              'Bloco B'),
    ('Enfermaria 301', 'Maternidade',            'Bloco C'),
    ('Enfermaria 302', 'Pediatria',              'Bloco C')
) AS e (nome, descricao, bloco)
JOIN bloco b ON b.nome = e.bloco
ON CONFLICT (nome, bloco_id) DO NOTHING;

INSERT INTO leito (codigo, enfermaria_id, status, atualizado_por_id)
SELECT l.codigo, e.id, l.status, u.id
FROM (VALUES
    ('101-01', 'Enfermaria 101', 'Bloco A', 'OCUPADO'),
    ('101-02', 'Enfermaria 101', 'Bloco A', 'OCUPADO'),
    ('101-03', 'Enfermaria 101', 'Bloco A', 'DISPONIVEL'),
    ('101-04', 'Enfermaria 101', 'Bloco A', 'LIMPEZA'),
    ('102-01', 'Enfermaria 102', 'Bloco A', 'OCUPADO'),
    ('102-02', 'Enfermaria 102', 'Bloco A', 'OCUPADO'),
    ('102-03', 'Enfermaria 102', 'Bloco A', 'OCUPADO'),
    ('102-04', 'Enfermaria 102', 'Bloco A', 'BLOQUEADO'),
    ('201-01', 'Enfermaria 201', 'Bloco B', 'DISPONIVEL'),
    ('201-02', 'Enfermaria 201', 'Bloco B', 'OCUPADO'),
    ('201-03', 'Enfermaria 201', 'Bloco B', 'DISPONIVEL'),
    ('201-04', 'Enfermaria 201', 'Bloco B', 'LIMPEZA'),
    ('202-01', 'Enfermaria 202', 'Bloco B', 'OCUPADO'),
    ('202-02', 'Enfermaria 202', 'Bloco B', 'DISPONIVEL'),
    ('202-03', 'Enfermaria 202', 'Bloco B', 'DISPONIVEL'),
    ('202-04', 'Enfermaria 202', 'Bloco B', 'DISPONIVEL'),
    ('301-01', 'Enfermaria 301', 'Bloco C', 'OCUPADO'),
    ('301-02', 'Enfermaria 301', 'Bloco C', 'OCUPADO'),
    ('301-03', 'Enfermaria 301', 'Bloco C', 'LIMPEZA'),
    ('301-04', 'Enfermaria 301', 'Bloco C', 'DISPONIVEL'),
    ('302-01', 'Enfermaria 302', 'Bloco C', 'DISPONIVEL'),
    ('302-02', 'Enfermaria 302', 'Bloco C', 'OCUPADO'),
    ('302-03', 'Enfermaria 302', 'Bloco C', 'BLOQUEADO'),
    ('302-04', 'Enfermaria 302', 'Bloco C', 'DISPONIVEL')
) AS l (codigo, enfermaria, bloco, status)
JOIN bloco b ON b.nome = l.bloco
JOIN enfermaria e ON e.nome = l.enfermaria AND e.bloco_id = b.id
JOIN usuario u ON u.email = 'tecnico@sigoh.com'
ON CONFLICT (enfermaria_id, codigo) WHERE ativo = TRUE DO NOTHING;
