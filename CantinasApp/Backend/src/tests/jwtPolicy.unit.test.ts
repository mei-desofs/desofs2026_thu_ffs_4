import jwt from "jsonwebtoken";
import {
  assertTrustedJwtStructure,
  JWT_AUDIENCE,
  JWT_ISSUER,
  JWT_TOKEN_TYPE,
} from "../utils/jwtPolicy";

const secret = "test-secret";

describe("jwtPolicy", () => {
  it("accepts a standard HS256 JWT without untrusted key headers", () => {
    const token = jwt.sign(
      { id: 1, role: "admin", sessionId: "abc", tokenType: JWT_TOKEN_TYPE },
      secret as jwt.Secret,
      {
        algorithm: "HS256",
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
        header: { alg: "HS256", typ: "JWT" },
      } as jwt.SignOptions,
    );

    expect(() => assertTrustedJwtStructure(token)).not.toThrow();
  });

  it("rejects a JWT that uses an algorithm outside the allowlist", () => {
    const token = jwt.sign(
      { id: 1, role: "admin", sessionId: "abc", tokenType: JWT_TOKEN_TYPE },
      secret as jwt.Secret,
      {
        algorithm: "HS384",
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
        header: { alg: "HS384", typ: "JWT" },
      } as jwt.SignOptions,
    );

    expect(() => assertTrustedJwtStructure(token)).toThrow("Token inválido");
  });

  it("rejects a JWT that advertises an untrusted key source", () => {
    const token = jwt.sign(
      { id: 1, role: "admin", sessionId: "abc", tokenType: JWT_TOKEN_TYPE },
      secret as jwt.Secret,
      {
        algorithm: "HS256",
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
        header: {
          alg: "HS256",
          typ: "JWT",
          jku: "https://evil.example/jwks.json",
        },
      } as jwt.SignOptions,
    );

    expect(() => assertTrustedJwtStructure(token)).toThrow("Token inválido");
  });
});
