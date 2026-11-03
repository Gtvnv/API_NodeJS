/**
 * Codigos de status HTTP usados pela aplicacao.
 * Centralizar aqui evita "numeros magicos" espalhados pelo codigo
 * e deixa a intencao de cada resposta explicita.
 */
export const HttpStatus = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatusCode = (typeof HttpStatus)[keyof typeof HttpStatus];
