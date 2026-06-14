import jwt, { JwtHeader } from "jsonwebtoken";

export const JWT_ISSUER = "cantinasapp-backend";
export const JWT_AUDIENCE = "cantinasapp-backend-api";
export const JWT_TOKEN_TYPE = "access" as const;
export const ALLOWED_JWT_ALGORITHMS = ["HS256"] as const;

export type JwtAccessTokenPayload = {
  id: number;
  role: string;
  sessionId: string;
  tokenType: typeof JWT_TOKEN_TYPE;
};

type DecodedJwt = {
  header?: JwtHeader & {
    jku?: string;
    x5u?: string;
    jwk?: unknown;
  };
  payload?: unknown;
};

export const assertTrustedJwtStructure = (token: string) => {
  const decoded = jwt.decode(token, { complete: true }) as DecodedJwt | null;

  if (!decoded || !decoded.header) {
    throw new Error("Token inválido");
  }

  const { header } = decoded;

  if (header.jku || header.x5u || header.jwk) {
    throw new Error("Token inválido");
  }

  if (
    !ALLOWED_JWT_ALGORITHMS.includes(
      header.alg as (typeof ALLOWED_JWT_ALGORITHMS)[number],
    )
  ) {
    throw new Error("Token inválido");
  }

  if (header.typ && header.typ !== "JWT") {
    throw new Error("Token inválido");
  }

  return decoded;
};
