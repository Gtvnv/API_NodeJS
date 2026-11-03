import { PodcastEpisode } from "../domain/podcast.js";
import { IPodcastRepository } from "./podcast-repository.interface.js";
import { EPISODES } from "./podcast-data.js";

/**
 * Implementacao em memoria do repositorio de episodios.
 *
 * Le os dados de uma lista estatica (mock). As camadas superiores
 * (service / controller) dependem da interface IPodcastRepository e
 * nao conhecem esta origem de dados.
 */
export class PodcastRepository implements IPodcastRepository {
  /** Retorna todos os episodios disponiveis. */
  async findAll(): Promise<PodcastEpisode[]> {
    return [...EPISODES];
  }

  /**
   * Retorna os episodios cujo nome do podcast corresponde ao filtro.
   * A comparacao e case-insensitive e ignora espacos nas bordas.
   */
  async findByPodcastName(podcastName: string): Promise<PodcastEpisode[]> {
    const normalized = podcastName.trim().toLowerCase();
    return EPISODES.filter(
      (item) => item.podcastName.toLowerCase() === normalized
    );
  }
}
