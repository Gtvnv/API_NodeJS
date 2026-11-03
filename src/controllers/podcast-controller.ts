import { ServerResponse } from "node:http";
import { PodcastService } from "../services/podcast-service.js";
import { sendJson } from "../utils/http-helpers.js";
import { HttpStatus } from "../utils/http-status.js";

/**
 * Controller dos podcasts.
 *
 * Responsavel por extrair dados da requisicao HTTP, delegar a regra
 * de negocio ao service e devolver a resposta. Sem logica de dominio aqui.
 */
export class PodcastController {
  constructor(private readonly service: PodcastService) {}

  /** GET /list -> todos os episodios. */
  async list(response: ServerResponse): Promise<void> {
    const episodes = await this.service.listAll();
    sendJson(response, HttpStatus.OK, episodes);
  }

  /** GET /episode?podcastName={nome} -> episodios filtrados. */
  async listByPodcastName(url: URL, response: ServerResponse): Promise<void> {
    const podcastName = url.searchParams.get("podcastName") ?? undefined;
    const episodes = await this.service.listByPodcastName(podcastName);
    sendJson(response, HttpStatus.OK, episodes);
  }
}
