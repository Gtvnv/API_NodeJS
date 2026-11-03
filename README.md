# Gerenciador de Podcasts — API Node.js com TypeScript e HTTP Module

API REST construída em **Node.js** com **TypeScript**, usando **apenas o módulo `http` nativo** — sem Express, Fastify ou qualquer framework. O objetivo é demonstrar, do zero, como estruturar uma API bem organizada (roteamento, camadas, validação, testes) sem depender de um framework web.

## Sumário

- [Descrição](#descrição)
- [Funcionalidades](#funcionalidades)
- [Endpoints](#endpoints)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Como executar](#como-executar)
- [Testes](#testes)
- [Build de produção](#build-de-produção)
- [Scripts disponíveis](#scripts-disponíveis)
- [Decisões de projeto](#decisões-de-projeto)
- [Licença](#licença)

## Descrição

O Podcast Manager centraliza episódios de podcasts (em formato de vídeo) organizados por categoria, no estilo de um catálogo. Permite listar todos os episódios e filtrar por nome do podcast.

## Funcionalidades

- **Listar episódios** organizados por categorias (saúde, esporte, humor, mentalidade, etc.).
- **Filtrar episódios** por nome do podcast.
- **Health check** para monitoramento.
- Tratamento de erros com **status codes** apropriados (`400`, `404`, `500`).
- **Logging** de cada requisição e **graceful shutdown**.
- **Testes automatizados** (unitários e end-to-end) com o runner nativo do Node.

## Endpoints

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/health` | Verificação de saúde (status + uptime). |
| `GET` | `/list` | Lista todos os episódios. |
| `GET` | `/episode?podcastName={nome}` | Lista os episódios de um podcast. |

### `GET /health`

Retorna `200` com o status e o uptime do processo.

```json
{ "status": "ok", "uptime": 12.34 }
```

### `GET /list`

Retorna todos os episódios disponíveis.

```json
[
  {
    "podcastName": "flow",
    "episode": "CBUM - Flow #319",
    "videoId": "pQSuQmUfS30",
    "cover": "https://i.ytimg.com/vi/pQSuQmUfS30/maxresdefault.jpg",
    "link": "https://www.youtube.com/watch?v=pQSuQmUfS30",
    "categories": ["saude", "esporte", "bodybuilder"]
  }
]
```

### `GET /episode?podcastName={nome}`

Retorna os episódios de um podcast específico.

- Exemplo: `GET /episode?podcastName=flow`
- `400` quando `podcastName` não é informado.
- `404` quando nenhum episódio é encontrado.

```json
{ "error": "Nenhum episodio encontrado para o podcast 'xyz'." }
```

## Arquitetura

O projeto segue uma separação de responsabilidades em camadas, com a dependência apontando sempre para dentro (estilo Clean Architecture). O **Service** depende de uma **interface** de repositório, não da implementação concreta — o que desacopla a regra de negócio da fonte de dados e facilita os testes.

```
Requisição HTTP
      │
      ▼
   Router ──► Controller ──► Service ──► Repository
 (rotas,      (HTTP:        (regra de    (fonte de
  erros,       req/res)      negócio)      dados)
  log)
```

Estrutura de pastas:

```
src/
├── index.ts                              # Ponto de entrada: sobe o servidor e trata sinais (shutdown)
├── server.ts                             # Compõe as dependências e cria o servidor HTTP
├── router.ts                             # Roteamento (método + path), tratamento de erros e log
├── config/
│   └── env.ts                            # Configuração via variáveis de ambiente (porta, host)
├── controllers/
│   └── podcast-controller.ts             # Lê a requisição, delega ao service, responde
├── services/
│   ├── podcast-service.ts                # Regra de negócio e validações
│   └── podcast-service.test.ts           # Testes unitários do service (com repositório fake)
├── repositories/
│   ├── podcast-repository.interface.ts   # Contrato da fonte de dados (abstração)
│   ├── podcast-repository.ts             # Implementação em memória
│   └── podcast-data.ts                   # Dados mock dos episódios
├── domain/
│   └── podcast.ts                        # Modelo de domínio (PodcastEpisode)
├── errors/
│   └── app-error.ts                      # Erro de aplicação com status HTTP tipado
├── utils/
│   ├── http-helpers.ts                   # Respostas JSON/erro padronizadas
│   ├── http-status.ts                    # Constantes de status HTTP (sem números mágicos)
│   └── logger.ts                         # Logger simples com timestamp
└── server.test.ts                        # Testes end-to-end dos endpoints
```

O `server.ts` faz a injeção manual das dependências; o `router.ts` resolve a rota com base em método + path, usando a classe `URL` nativa para ler a query string.

## Tecnologias

- **Node.js** — runtime (módulo `http` nativo).
- **TypeScript** — tipagem estática.
- **node:test** — runner de testes nativo (sem framework de teste externo).
- **tsx** — executa TypeScript em desenvolvimento com hot reload.
- **tsup** — empacota o projeto para produção.
- **@types/node** — definições de tipo do Node.

## Como executar

Pré-requisitos: **Node.js 20.11+** instalado.

```bash
# 1. Instale as dependências
npm install

# 2. Rode em modo desenvolvimento (hot reload)
npm run start:dev

# A API sobe em http://localhost:3333
```

A porta pode ser alterada via variável de ambiente `PORT`.

Testando os endpoints:

```bash
curl http://localhost:3333/health
curl http://localhost:3333/list
curl "http://localhost:3333/episode?podcastName=flow"
```

## Testes

```bash
npm test
```

Os testes usam o runner nativo (`node:test`): testes unitários do service (injetando um repositório _fake_) e testes end-to-end que sobem o servidor real em uma porta efêmera e exercitam cada endpoint.

## Build de produção

```bash
npm run build   # gera a pasta dist/
npm start       # executa o build
```

## Scripts disponíveis

| Script | Descrição |
| --- | --- |
| `npm run start:dev` | Sobe a API em modo desenvolvimento com hot reload. |
| `npm start` | Executa o build de produção (`dist/`). |
| `npm run build` | Empacota o projeto com o tsup. |
| `npm test` | Roda a suíte de testes. |
| `npm run typecheck` | Verifica os tipos sem gerar saída. |

## Decisões de projeto

- **Sem framework web:** todo o roteamento e o parsing de requisição usam apenas o módulo `http` e a classe `URL` nativos, para evidenciar o que um framework normalmente abstrai.
- **Camadas com dependência para dentro:** o service não conhece HTTP nem a origem dos dados; depende da interface `IPodcastRepository`. Trocar o mock por um banco real não exige mudança na regra de negócio.
- **Erros como cidadãos de primeira classe:** a classe `AppError` carrega o status HTTP; o `Router` traduz isso em resposta, e qualquer erro inesperado vira `500` sem vazar detalhes.
- **Status codes centralizados:** constantes em `http-status.ts` evitam números mágicos e dão tipagem às respostas.
- **Testes sem dependências extras:** o `node:test` cobre service (unitário) e endpoints (e2e), mantendo o projeto enxuto.

## Licença

Distribuído sob a licença MIT.
