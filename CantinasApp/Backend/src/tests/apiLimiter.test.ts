import request from "supertest";
import { createTestApp } from "./testApp";

describe("apiLimiter", () => {
  let app: ReturnType<typeof createTestApp>;

  beforeEach(() => {
    app = createTestApp();
  });

  it("should allow normal API requests", async () => {
    const res = await request(app).get("/api");

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it("should NOT block before reaching limit (200)", async () => {
    const results: number[] = [];

    for (let i = 0; i < 30; i++) {
      const res = await request(app).get("/api");
      results.push(res.status);
    }

    expect(results.every((s) => s === 200)).toBe(true);
  });

  it("should eventually block after many requests", async () => {
    let blocked = false;

    for (let i = 0; i < 220; i++) {
      const res = await request(app).get("/api");

      if (res.status === 429) {
        blocked = true;
        break;
      }
    }

    expect(blocked).toBe(true);
  });
});