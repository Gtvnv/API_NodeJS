import { PodcastEpisode } from "../domain/podcast.js";
import { AppError } from "../errors/app-error.js";
import { IPodcastRepository } from "../repositories/podcast-repository.interface.js";
import { HttpStatus } from "../utils/http-status.js";

/**
 * Regra de negocio dos podcasts.
 *
 * O service concentra as validacoes e orquestra o repositorio.
 * Depende da abstracao IPodcastRepository, nao da implementacao concreta,
 * e nao conhece detalhes de HTTP (req/res).
 */
export class PodcastService {
  constructor(private readonly repository: IPodcastRepository) {}

  /** Lista todos os episodios. */
  async listAll(): Promise<PodcastEpisode[]> {
    return this.repository.findAll();
  }

  /**
   * Lista os episodios de um podcast especifico.
   * @throws {AppError} 400 quando o nome nao e informado.
   * @throws {AppError} 404 quando nenhum episodio e encontrado.
   */
  async listByPodcastName(podcastName?: string): Promise<PodcastEpisode[]> {
    if (!podcastName || podcastName.trim().length === 0) {
      throw new AppError(
        "O parametro de busca 'podcastName' e obrigatorio.",
        HttpStatus.BAD_REQUEST
      );
    }

    const episodes = await this.repository.findByPodcastName(podcastName);

    if (episodes.length === 0) {
      throw new AppError(
        `Nenhum episodio encontrado para o podcast '${podcastName}'.`,
        HttpStatus.NOT_FOUND
      );
    }

    return episodes;
  }
}
