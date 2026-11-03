# Gerenciador de Podcasts — API Node.js com TypeScript e HTTP Module

API REST construída em **Node.js** com **TypeScript**, usando **apenas o módulo `http` nativo** — sem Express, Fastify ou qualquer framework. Projeto desenvolvido como Desafio de Projeto da [DIO](https://www.dio.me/), inspirado no repositório do expert [Felipe Aguiar](https://github.com/felipeAguiarCode/node-ts-webapi-without-frameworks-podcast-menager).

## Descrição

O Podcast Manager centraliza episódios de podcasts (em formato de vídeo) organizados por categoria, no estilo de um catálogo tipo Netflix. Permite listar todos os episódios e filtrar por nome do podcast.

## Funcionalidades

- **Listar episódios** organizados por categorias (saúde, esporte, humor, mentalidade, etc.).
- **Filtrar episódios** por nome do podcast.
- **Health check** para monitoramento.
- Tratamento de erros com **status codes** apropriados (`400`, `404`, `500`).
- **Logging** de cada requisição e **graceful shutdown**.
- **Testes automatizados** (unitários e end-to-end) com o runner nativo do Node.

## Endpoints

### `GET /health`

Verificação de saúde da aplicação. Retorna `200` com o status e o uptime do processo.

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

## Arquitetura

O projeto segue uma separação de responsabilidades em camadas, com a dependência apontando sempre para dentro (estilo Clean Architecture). O **Service** depende de uma **interface** de repositório, não da implementação concreta — o que desacopla a regra de negócio da fonte de dados e facilita os testes.

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

Fluxo da requisição: **Router → Controller → Service → Repository**. O `server.ts` faz a injeção manual das dependências; o `router.ts` resolve a rota com base em método + path, usando a classe `URL` nativa para ler a query string.

## Tecnologias

- **Node.js** — runtime (módulo `http` nativo).
- **TypeScript** — tipagem estática.
- **node:test** — runner de testes nativo (sem framework de teste externo).
- **tsx** — executa TypeScript em desenvolvimento com hot reload.
- **tsup** — empacota o projeto para produção.
- **@types/node** — definições de tipo do Node.

## Passo a passo (como foi feito)

1. Inicializei o projeto Node com `package.json` e configurei o `tsconfig.json` (modo estrito, `NodeNext`).
2. Instalei as dependências de desenvolvimento: `typescript`, `tsx`, `tsup`, `@types/node`.
3. Modelei o problema de negócio: um episódio de podcast (`domain/podcast.ts`).
4. Criei o **servidor HTTP** com o módulo nativo e um **roteador** dedicado.
5. Separei em camadas: **Controller** (HTTP), **Service** (regras) e **Repository** (dados), com o service dependendo de uma **interface**.
6. Implementei o endpoint `GET /list`.
7. Implementei o `GET /episode` lendo a **query string** com a classe `URL`.
8. Adicionei **tratamento de erros** com status codes (classe `AppError`) e **constantes** para eliminar números mágicos.
9. Acrescentei **logging** por requisição, **health check** e **graceful shutdown**.
10. Escrevi **testes** unitários (service) e end-to-end (endpoints) com o runner nativo do Node.
11. Documentei tudo neste README e subi o projeto para o GitHub.

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

## Links úteis

- Repositório de referência (expert): <https://github.com/felipeAguiarCode/node-ts-webapi-without-frameworks-podcast-menager>
- [Digital Innovation One (DIO)](https://www.dio.me/)

## Licença

Distribuído sob a licença MIT.
