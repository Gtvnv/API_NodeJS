import { IncomingMessage, ServerResponse } from "node:http";
import { PodcastController } from "./controllers/podcast-controller.js";
import { AppError } from "./errors/app-error.js";
import { sendError, sendJson } from "./utils/http-helpers.js";
import { HttpStatus } from "./utils/http-status.js";
import { logger } from "./utils/logger.js";

/**
 * Roteador da aplicacao.
 *
 * Centraliza a resolucao de rotas (metodo + path), o tratamento de erros
 * e o log de cada requisicao. Mantem o server.ts focado apenas em criar
 * e configurar o servidor HTTP.
 */
export class Router {
  constructor(private readonly controller: PodcastController) {}

  async handle(
    request: IncomingMessage,
    response: ServerResponse
  ): Promise<void> {
    const method = request.method ?? "GET";
    const host = request.headers.host ?? "localhost";
    const url = new URL(request.url ?? "/", `http://${host}`);
    const path = url.pathname;

    try {
      await this.route(method, path, url, response);
    } catch (error) {
      this.handleError(error, response);
    } finally {
      logger.info(`${method} ${path} -> ${response.statusCode}`);
    }
  }

  private async route(
    method: string,
    path: string,
    url: URL,
    response: ServerResponse
  ): Promise<void> {
    if (method === "GET" && path === "/health") {
      sendJson(response, HttpStatus.OK, { status: "ok", uptime: process.uptime() });
      return;
    }

    if (method === "GET" && path === "/list") {
      await this.controller.list(response);
      return;
    }

    if (method === "GET" && path === "/episode") {
      await this.controller.listByPodcastName(url, response);
      return;
    }

    sendError(
      response,
      HttpStatus.NOT_FOUND,
      `Rota nao encontrada: ${method} ${path}`
    );
  }

  private handleError(error: unknown, response: ServerResponse): void {
    if (error instanceof AppError) {
      sendError(response, error.statusCode, error.message);
      return;
    }

    logger.error("Erro inesperado ao processar a requisicao.", error);
    sendError(
      response,
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Erro interno do servidor."
    );
  }
}
