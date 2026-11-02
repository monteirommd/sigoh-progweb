# SiGOH — Sistema de Gestão da Ocupação Hospitalar

Aplicação web para acompanhar, em tempo quase real, a ocupação dos leitos de um hospital. Os leitos são organizados em **Bloco → Enfermaria → Leito**. Cada mudança de status fica registrada em um histórico, e a taxa de ocupação é calculada por bloco e para o hospital inteiro.

Trabalho acadêmico de Programação Web: API REST em Spring Boot + front-end React separado.

**Repositório:** https://github.com/monteirommd/sigoh-progweb

## Funcionalidades

- **Login com JWT** e quatro papéis de acesso (veja [Papéis e permissões](#papéis-e-permissões))
- **Painel de ocupação**: taxa geral do hospital, contagem por status e cards por bloco com classificação de risco
- **Mapa de leitos**: todos os leitos agrupados por bloco e enfermaria, com troca de status e histórico
- **Tela do técnico**: versão para celular, com seletor de bloco e botões grandes
- **Cadastros (CRUD completo)**: blocos, enfermarias, leitos e usuários
- **Histórico de status**: quem mudou, de qual status para qual, e quando
- **Relatório em PDF** gerado pela API: taxa geral, ocupação por bloco e lista de leitos
- **Atualização automática** das telas a cada 5 segundos (polling)
- **Acessibilidade WCAG AA** e layout responsivo

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Back-end | Java 17, Spring Boot 4.0.9, Spring Data JPA (Hibernate 7), Spring Security 7 + OAuth2 Resource Server (JWT), Bean Validation, Flyway, Lombok, springdoc-openapi (Swagger), OpenPDF (relatório PDF) |
| Banco de dados | PostgreSQL 16 |
| Infraestrutura | Docker Compose (banco, API e front-end com Nginx) |
| Front-end | React 19, TypeScript 6, Vite 8, React Router 7, lucide-react (ícones), CSS puro |

## Como executar

### Executar o projeto (Docker)

Pré-requisito: **Docker**.

```bash
docker compose up -d --build
```

Sobe três contêineres: banco (PostgreSQL 16), API (Spring Boot) e front-end (Nginx). O primeiro build leva alguns minutos.

| Serviço | Endereço |
|---|---|
| Aplicação | **http://localhost:5173** |
| API | http://localhost:8080 |
| Swagger | http://localhost:8080/swagger-ui/index.html |

Na primeira execução, o Flyway cria as tabelas (`V1`) e os usuários de teste (`V2`). O banco começa sem blocos: entre como administrador e cadastre a estrutura em **Estrutura** (blocos → enfermarias → leitos).

Para testar as rotas protegidas no Swagger, faça `POST /auth/login`, copie o `token` e cole-o no botão **Authorize**.

Para parar: `docker compose down`. Para também apagar os dados: `docker compose down -v`.

### Ambiente de desenvolvimento

Pré-requisitos: Docker, Java 17+ (o Maven vem embutido, via `./mvnw`) e Node.js 20+.

No desenvolvimento, só o banco roda no Docker. A API e o front rodam localmente, com recarregamento automático. Se os contêineres `api` e `web` estiverem rodando, pare-os antes com `docker compose stop api web`, porque eles ocupam as portas 8080 e 5173.

```bash
docker compose up -d db

cd backend
./mvnw spring-boot:run

cd frontend
npm install
npm run dev
```

## Usuários de teste

| Papel | E-mail | Senha |
|---|---|---|
| Administrador | `admin@sigoh.com` | `admin123` |
| Gestão | `gestor@sigoh.com` | `gestor123` |
| Técnico | `tecnico@sigoh.com` | `tecnico123` |
| Visitante | `visitante@sigoh.com` | `visitante123` |

## Papéis e permissões

| Ação | ADMIN | GESTAO | TECNICO | VISITANTE |
|---|:-:|:-:|:-:|:-:|
| Ver painel, mapa, leitos e histórico | ✅ | ✅ | ✅ | ✅ |
| Alterar status de leito | ✅ | ✅ | ✅ | ❌ |
| Criar, editar e excluir blocos, enfermarias e leitos | ✅ | ❌ | ❌ | ❌ |
| Gerenciar usuários | ✅ | ❌ | ❌ | ❌ |
| Tela inicial | Painel | Painel | Tela do técnico | Painel |

**Correspondência com o enunciado:** `ADMIN` é o **ROLE_ADMIN** (CRUD total) e `VISITANTE` é o **ROLE_USER** (somente leitura). `GESTAO` e `TECNICO` são papéis operacionais intermediários: podem alterar o status dos leitos, mas não a estrutura.

As permissões são garantidas **no back-end** (`SecurityConfig`), que responde **401** sem token válido e **403** quando o papel não tem permissão. Esconder botões no front-end é só conveniência de interface.

## API

| Método | Rota | Acesso |
|---|---|---|
| POST | `/auth/login` | Público |
| GET | `/api/blocos`, `/api/blocos/{id}` | Autenticado |
| POST / PUT / DELETE | `/api/blocos`, `/api/blocos/{id}` | ADMIN |
| GET | `/api/enfermarias?blocoId=`, `/api/enfermarias/{id}` | Autenticado |
| POST / PUT / DELETE | `/api/enfermarias`, `/api/enfermarias/{id}` | ADMIN |
| GET | `/api/leitos?blocoId=&enfermariaId=`, `/api/leitos/{id}` | Autenticado |
| POST / PUT / DELETE | `/api/leitos`, `/api/leitos/{id}` | ADMIN |
| PATCH | `/api/leitos/{id}/status` | ADMIN, GESTAO, TECNICO |
| GET | `/api/leitos/{id}/historico` | Autenticado |
| GET | `/api/ocupacao/blocos` | Autenticado |
| GET | `/api/relatorios/ocupacao` (PDF) | Autenticado |
| GET / POST / PUT / DELETE | `/api/usuarios`, `/api/usuarios/{id}` | ADMIN |

Todos os erros seguem o mesmo formato:

```json
{ "timestamp": "...", "status": 422, "error": "Unprocessable Content", "message": "Bloco possui enfermarias vinculadas e não pode ser excluído", "path": "/api/blocos/1" }
```

| Status | Quando |
|---|---|
| 400 | Dados inválidos (validação) ou JSON mal formado |
| 401 | Login inválido, token ausente ou expirado |
| 403 | O papel não tem permissão |
| 404 | Recurso não encontrado |
| 422 | Regra de negócio violada (nome duplicado, exclusão com vínculos, mesmo status) |

## Regras de negócio

- **Taxa de ocupação** = ocupados ÷ (total − bloqueados) × 100. Leitos bloqueados não contam, porque não estão disponíveis para uso. A taxa é calculada a cada consulta e nunca é gravada.
- **Classificação da taxa**: por bloco (Seguro < 80% ≤ Atenção < 90% ≤ Risco < 95% ≤ Crítico) e geral do hospital (Normalidade < 75% ≤ Alerta < 85% ≤ Crítico < 95% ≤ Colapso).
- **Status do leito**: Disponível, Ocupado, Em limpeza ou Bloqueado. A transição é livre, mas só pode ser feita pelo endpoint de status, que grava leito e histórico **na mesma transação**. Mudar para o mesmo status atual é recusado.
- **Histórico** é somente de inclusão: um registro nunca é alterado nem apagado.
- **Exclusões**:
  - Bloco com enfermarias e enfermaria com leitos não podem ser excluídos (422).
  - Leito e usuário têm exclusão **lógica** (`ativo = false`): somem das listagens, mas o histórico é preservado.
  - O código do leito volta a ficar disponível depois da exclusão, graças a um índice único parcial no banco.
- **Unicidade**: nome de bloco; nome de enfermaria dentro do bloco; código de leito dentro da enfermaria (entre os ativos); e-mail de usuário.

## Arquitetura

### Back-end (`backend/`)

Organizado **por funcionalidade**. Cada pacote contém `Entity`, `Repository`, `Service`, `Mapper`, `Controller` e `dto/`.

```
com.sigoh.api
├── auth/        login e geração do token JWT
├── usuario/     CRUD de usuários e papéis
├── bloco/       CRUD de blocos
├── enfermaria/  CRUD de enfermarias
├── leito/       CRUD, status e consulta de leitos
├── historico/   histórico de mudanças de status
├── ocupacao/    cálculo e classificação da taxa por bloco
├── relatorio/   relatório de ocupação em PDF (OpenPDF)
├── common/      tratamento global de erros (ApiError)
└── config/      segurança (JWT, CORS, papéis) e Swagger
```

Padrões adotados:

- A entidade nunca é devolvida no HTTP. A API usa DTOs (`record`) convertidos por Mappers.
- Validação com Bean Validation nos DTOs de entrada.
- Injeção de dependência por construtor.
- Transações nos Services (`readOnly` nas leituras).
- Relacionamentos `LAZY`, com `@EntityGraph` para evitar o problema N+1 (a listagem de leitos usa uma única consulta SQL).
- Schema versionado com Flyway (`db/migration`). O Hibernate apenas valida (`ddl-auto: validate`).

### Front-end (`frontend/src`)

```
├── pages/       uma página por rota
├── components/  componentes reutilizáveis (mapa, diálogos, cards, trilha)
├── services/    acesso à API; api.ts é o único ponto com fetch (token + tratamento de erros)
├── context/     sessão do usuário (AuthProvider)
├── hooks/       useAuth, useAtualizacaoPeriodica (polling)
├── routes/      RotaProtegida (bloqueio por login e por papel)
├── types/       tipos espelhando os DTOs da API, um arquivo por domínio
├── utils/       rótulos de status, permissões, classificação da taxa, datas
├── styles/      CSS por componente e por tela
└── index.css    variáveis globais (cores, fontes, espaçamentos) e estilos base
```

## Testes

```bash
cd backend
./mvnw test
```

> ⚠️ O banco precisa estar rodando (`docker compose up -d db`). O teste `ApiApplicationTests` sobe a aplicação completa e valida as migrations e as entidades contra o PostgreSQL.

| Classe | Tipo | O que verifica |
|---|---|---|
| `LeitoServiceTest` | Unidade (JUnit 5 + Mockito) | Alterar status grava leito e histórico; mesmo status é recusado sem gravar; leito inexistente gera 404; código duplicado é recusado sem salvar; exclusão é lógica |
| `OcupacaoServiceTest` | Unidade parametrizada | Fórmula da taxa com leitos bloqueados, bloco cheio, bloco vazio e arredondamento |
| `ApiApplicationTests` | Integração | A aplicação inicia, as migrations aplicam e as entidades batem com o schema |

Nos testes de unidade, os repositórios são substituídos por *mocks* do Mockito, o que permite testar as regras do `LeitoService` sem banco de dados.

## Acessibilidade (WCAG AA)

- Todas as combinações de texto e fundo foram verificadas: contraste ≥ 4.5:1.
- O status é sempre informado por **cor + texto**, nunca só pela cor.
- Estrutura semântica: `header`, `nav`, `main`, `section`, `article`, títulos hierárquicos, listas e tabelas com `caption` e `th scope`.
- Formulários com `<label for>`. Erros anunciados com `role="alert"` e sucessos com `role="status"`.
- Botões só com ícone têm `aria-label` descritivo (ex.: "Editar Bloco Norte").
- Navegação completa por teclado, com foco visível e o link "Pular para o conteúdo".
- Janelas com `<dialog>` nativo: o foco fica preso dentro da janela, Esc fecha e o foco volta ao elemento de origem.
- `lang="pt-BR"` no documento.

## Decisões e limitações conhecidas

- **Atualização por polling (5 s)** em vez de WebSocket: mais simples e suficiente para o volume do sistema.
- **JWT sem estado**: um usuário desativado continua com o token válido até ele expirar (8 h). Isso evita consultar o banco a cada requisição.
- **Chave do JWT e origens do CORS** vêm das variáveis de ambiente `JWT_SECRET` e `CORS_ORIGINS`. Os valores padrão do `application.yml` servem apenas para desenvolvimento.
