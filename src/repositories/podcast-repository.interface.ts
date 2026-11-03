import { PodcastEpisode } from "../domain/podcast.js";

/**
 * Contrato da fonte de dados de episodios.
 *
 * O service depende desta abstracao, nao da implementacao concreta.
 * Isso permite trocar a origem dos dados (mock, banco, API externa)
 * e facilita a escrita de testes com implementacoes falsas (fakes).
 */
export interface IPodcastRepository {
  /** Retorna todos os episodios disponiveis. */
  findAll(): Promise<PodcastEpisode[]>;

  /** Retorna os episodios cujo nome do podcast corresponde ao filtro. */
  findByPodcastName(podcastName: string): Promise<PodcastEpisode[]>;
}
