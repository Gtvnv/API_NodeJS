/**
 * Configuracao da aplicacao lida a partir de variaveis de ambiente,
 * com valores padrao sensatos para desenvolvimento.
 */
export const env = {
  port: Number(process.env.PORT) || 3333,
  host: process.env.HOST || "localhost",
} as const;
