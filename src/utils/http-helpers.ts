import { ServerResponse } from "node:http";
import { HttpStatus, HttpStatusCode } from "./http-status.js";

/**
 * Utilitarios para padronizar respostas HTTP em JSON,
 * mantendo os controllers enxutos.
 */

/** Escreve uma resposta JSON com o status informado. */
export function sendJson(
  response: ServerResponse,
  statusCode: HttpStatusCode,
  payload: unknown
): void {
  const body = JSON.stringify(payload);
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  response.end(body);
}

/** Resposta de erro padronizada. */
export function sendError(
  response: ServerResponse,
  statusCode: HttpStatusCode,
  message: string
): void {
  sendJson(response, statusCode, { error: message });
}

export { HttpStatus };
