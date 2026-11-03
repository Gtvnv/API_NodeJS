import { PodcastEpisode } from "../domain/podcast.js";

/**
 * Dados estaticos dos episodios (mock).
 *
 * Simula a resposta de uma API externa / banco de dados. Em um cenario
 * real, estes dados viriam de uma fonte externa consultada pelo repositorio.
 */
export const EPISODES: readonly PodcastEpisode[] = [
  {
    podcastName: "flow",
    episode: "CBUM - Flow #319",
    videoId: "pQSuQmUfS30",
    cover: "https://i.ytimg.com/vi/pQSuQmUfS30/maxresdefault.jpg",
    link: "https://www.youtube.com/watch?v=pQSuQmUfS30",
    categories: ["saude", "esporte", "bodybuilder"],
  },
  {
    podcastName: "flow",
    episode: "RUBENS BARRICHELLO - Flow #339",
    videoId: "4KDGTdiOV4I",
    cover: "https://i.ytimg.com/vi/4KDGTdiOV4I/maxresdefault.jpg",
    link: "https://www.youtube.com/watch?v=4KDGTdiOV4I",
    categories: ["esporte", "corrida"],
  },
  {
    podcastName: "podpah",
    episode: "TRETINHA - Podpah #700",
    videoId: "dQw4w9WgXcQ",
    cover: "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    categories: ["humor", "entretenimento"],
  },
  {
    podcastName: "ciencia-sem-fim",
    episode: "O cerebro e a memoria #42",
    videoId: "aBcDeFgHiJk",
    cover: "https://i.ytimg.com/vi/aBcDeFgHiJk/maxresdefault.jpg",
    link: "https://www.youtube.com/watch?v=aBcDeFgHiJk",
    categories: ["saude", "mentalidade", "ciencia"],
  },
  {
    podcastName: "podpah",
    episode: "MENTALIDADE VENCEDORA - Podpah #512",
    videoId: "kLmNoPqRsT1",
    cover: "https://i.ytimg.com/vi/kLmNoPqRsT1/maxresdefault.jpg",
    link: "https://www.youtube.com/watch?v=kLmNoPqRsT1",
    categories: ["mentalidade", "humor"],
  },
];
