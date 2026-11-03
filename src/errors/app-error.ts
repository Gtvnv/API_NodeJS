import { HttpStatus, HttpStatusCode } from "../utils/http-status.js";

/**
 * Erro de aplicacao com status HTTP associado.
 * Permite que as camadas internas sinalizem a intencao de resposta
 * sem conhecer os detalhes do transporte HTTP.
 */
export class AppError extends Error {
  public readonly statusCode: HttpStatusCode;

  constructor(message: string, statusCode: HttpStatusCode = HttpStatus.BAD_REQUEST) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}
