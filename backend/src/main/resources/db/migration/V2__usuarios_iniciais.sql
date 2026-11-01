INSERT INTO usuario (nome, email, senha_hash, role) VALUES
    ('Administrador', 'admin@sigoh.com',     '$2a$10$hdK1IKwE1yh9SbCmo9St9ecIwBZheAWwRA/RAdFJ6aRapGxKeF78G', 'ADMIN'),
    ('Gestor',        'gestor@sigoh.com',    '$2a$10$BK379GR6ybA279S2VugO.O7iT/oBbvLMgoA.aEQi2xTkPZrLkheVq', 'GESTAO'),
    ('Tecnico',       'tecnico@sigoh.com',   '$2a$10$TKI/7XDnqRZfnfnJjK8XzudbAxFhyBR/ZIE9YwexfvPfkPaMq/ygW', 'TECNICO'),
    ('Visitante',     'visitante@sigoh.com', '$2a$10$R0eQ5EYVC1I9NRRDgpENZ.wecUVLQmj/dNVsRySKOfa5rRvIw5ryG', 'VISITANTE');
