import request from "supertest";
import { createTestApp } from "./testApp";

describe("authLimiter", () => {
  let app: ReturnType<typeof createTestApp>;

  beforeEach(() => {
    app = createTestApp();
  });

  it("should allow requests under limit", async () => {
    const res = await request(app).get("/auth");

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it("should block requests after exceeding limit", async () => {
    const results: number[] = [];

    for (let i = 0; i < 12; i++) {
      const res = await request(app).get("/auth");
      results.push(res.status);
    }

    expect(results).toContain(429);
  });

  it("should return rate limit message", async () => {
    for (let i = 0; i < 12; i++) {
      await request(app).get("/auth");
    }

    const res = await request(app).get("/auth");

    expect(res.status).toBe(429);
    expect(res.text).toContain("Too many auth attempts");
  });
});