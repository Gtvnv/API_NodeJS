/**
 * Modelo de dominio de um episodio de podcast.
 * Representa a unidade basica manipulada em toda a aplicacao.
 */
export interface PodcastEpisode {
  podcastName: string;
  episode: string;
  videoId: string;
  cover: string;
  link: string;
  categories: string[];
}
