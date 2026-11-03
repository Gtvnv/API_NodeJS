import http from "node:http";
import { PodcastController } from "./controllers/podcast-controller.js";
import { PodcastService } from "./services/podcast-service.js";
import { PodcastRepository } from "./repositories/podcast-repository.js";
import { Router } from "./router.js";

/**
 * Cria o servidor HTTP com as dependencias conectadas (injecao manual).
 *
 * Composicao: Repository -> Service -> Controller -> Router.
 * Usa apenas o modulo http nativo, sem frameworks.
 */
export function createServer(): http.Server {
  const repository = new PodcastRepository();
  const service = new PodcastService(repository);
  const controller = new PodcastController(service);
  const router = new Router(controller);

  return http.createServer((request, response) => {
    void router.handle(request, response);
  });
}
