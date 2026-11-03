import { createServer } from "./server.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";

const server = createServer();

server.listen(env.port, () => {
  logger.info(`Podcast Manager API rodando em http://${env.host}:${env.port}`);
  logger.info("Rotas disponiveis:");
  logger.info("  GET /health");
  logger.info("  GET /list");
  logger.info("  GET /episode?podcastName={nome}");
});

/**
 * Encerramento gracioso: ao receber um sinal de parada, para de aceitar
 * novas conexoes e finaliza o processo de forma limpa.
 */
function shutdown(signal: string): void {
  logger.info(`Sinal ${signal} recebido. Encerrando o servidor...`);
  server.close(() => {
    logger.info("Servidor encerrado com sucesso.");
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
