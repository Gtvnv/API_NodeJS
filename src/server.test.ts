import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { AddressInfo } from "node:net";
import { Server } from "node:http";
import { createServer } from "./server.js";
import { PodcastEpisode } from "./domain/podcast.js";

/**
 * Testes end-to-end: sobem o servidor real em uma porta efemera
 * e exercitam os endpoints via fetch, validando status e corpo.
 */
describe("Podcast API (e2e)", () => {
  let server: Server;
  let baseUrl: string;

  before(async () => {
    server = createServer();
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const { port } = server.address() as AddressInfo;
    baseUrl = `http://localhost:${port}`;
  });

  after(async () => {
    await new Promise<void>((resolve, reject) =>
      server.close((err) => (err ? reject(err) : resolve()))
    );
  });

  it("GET /health retorna 200 com status ok", async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.equal(res.status, 200);
    const body = (await res.json()) as { status: string };
    assert.equal(body.status, "ok");
  });

  it("GET /list retorna 200 com a lista de episodios", async () => {
    const res = await fetch(`${baseUrl}/list`);
    assert.equal(res.status, 200);
    const body = (await res.json()) as PodcastEpisode[];
    assert.ok(Array.isArray(body));
    assert.ok(body.length > 0);
  });

  it("GET /episode?podcastName=flow retorna 200 filtrado", async () => {
    const res = await fetch(`${baseUrl}/episode?podcastName=flow`);
    assert.equal(res.status, 200);
    const body = (await res.json()) as PodcastEpisode[];
    assert.ok(body.every((e) => e.podcastName === "flow"));
  });

  it("GET /episode sem parametro retorna 400", async () => {
    const res = await fetch(`${baseUrl}/episode`);
    assert.equal(res.status, 400);
    const body = (await res.json()) as { error: string };
    assert.ok(body.error);
  });

  it("GET /episode com nome inexistente retorna 404", async () => {
    const res = await fetch(`${baseUrl}/episode?podcastName=xyz`);
    assert.equal(res.status, 404);
  });

  it("rota desconhecida retorna 404", async () => {
    const res = await fetch(`${baseUrl}/nao-existe`);
    assert.equal(res.status, 404);
  });
});
