import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PodcastService } from "./podcast-service.js";
import { AppError } from "../errors/app-error.js";
import { PodcastEpisode } from "../domain/podcast.js";
import { IPodcastRepository } from "../repositories/podcast-repository.interface.js";

/**
 * Repositorio falso (fake) usado nos testes do service.
 * Como o service depende da interface, podemos injetar esta
 * implementacao controlada sem tocar na fonte de dados real.
 */
class FakePodcastRepository implements IPodcastRepository {
  constructor(private readonly data: PodcastEpisode[]) {}

  async findAll(): Promise<PodcastEpisode[]> {
    return this.data;
  }

  async findByPodcastName(podcastName: string): Promise<PodcastEpisode[]> {
    const normalized = podcastName.trim().toLowerCase();
    return this.data.filter(
      (item) => item.podcastName.toLowerCase() === normalized
    );
  }
}

const episode = (podcastName: string, title: string): PodcastEpisode => ({
  podcastName,
  episode: title,
  videoId: "id",
  cover: "cover",
  link: "link",
  categories: ["cat"],
});

describe("PodcastService", () => {
  const data = [
    episode("flow", "Ep 1"),
    episode("flow", "Ep 2"),
    episode("podpah", "Ep 3"),
  ];

  it("listAll retorna todos os episodios", async () => {
    const service = new PodcastService(new FakePodcastRepository(data));
    const result = await service.listAll();
    assert.equal(result.length, 3);
  });

  it("listByPodcastName filtra pelo nome do podcast", async () => {
    const service = new PodcastService(new FakePodcastRepository(data));
    const result = await service.listByPodcastName("flow");
    assert.equal(result.length, 2);
    assert.ok(result.every((e) => e.podcastName === "flow"));
  });

  it("listByPodcastName e case-insensitive e ignora espacos", async () => {
    const service = new PodcastService(new FakePodcastRepository(data));
    const result = await service.listByPodcastName("  FLOW  ");
    assert.equal(result.length, 2);
  });

  it("listByPodcastName lanca 400 quando o nome nao e informado", async () => {
    const service = new PodcastService(new FakePodcastRepository(data));
    await assert.rejects(
      () => service.listByPodcastName(undefined),
      (err: unknown) => err instanceof AppError && err.statusCode === 400
    );
  });

  it("listByPodcastName lanca 400 quando o nome e vazio", async () => {
    const service = new PodcastService(new FakePodcastRepository(data));
    await assert.rejects(
      () => service.listByPodcastName("   "),
      (err: unknown) => err instanceof AppError && err.statusCode === 400
    );
  });

  it("listByPodcastName lanca 404 quando nao encontra episodios", async () => {
    const service = new PodcastService(new FakePodcastRepository(data));
    await assert.rejects(
      () => service.listByPodcastName("inexistente"),
      (err: unknown) => err instanceof AppError && err.statusCode === 404
    );
  });
});
