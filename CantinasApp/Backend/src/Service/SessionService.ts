import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { JWT_SECRET } from "../Config/auth";
import {
  ALLOWED_JWT_ALGORITHMS,
  assertTrustedJwtStructure,
  JWT_AUDIENCE,
  JWT_ISSUER,
  JWT_TOKEN_TYPE,
  JwtAccessTokenPayload,
} from "../utils/jwtPolicy";
import {
  MAX_CONCURRENT_SESSIONS,
  SESSION_INACTIVITY_TIMEOUT_MINUTES,
  SESSION_MAX_LIFETIME_MINUTES,
} from "../Config/session";
import { User } from "../Model/User";
import { UserSession } from "../Model/UserSession";
import { generateSecureToken } from "../utils/tokenGenerator";

type SessionTokenPayload = JwtAccessTokenPayload & {
  iss: typeof JWT_ISSUER;
  aud: typeof JWT_AUDIENCE;
};

type ActiveSession = {
  id: number;
  sessionId: string;
  issuedAt: Date;
  lastActivityAt: Date;
  expiresAt: Date;
  revokedAt?: Date | null;
  revokedReason?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
};

const now = () => new Date();

const addMinutes = (date: Date, minutes: number) =>
  new Date(date.getTime() + minutes * 60 * 1000);

const isSessionExpired = (session: ActiveSession) => {
  const current = now();
  const inactivityDeadline = addMinutes(
    session.lastActivityAt,
    SESSION_INACTIVITY_TIMEOUT_MINUTES,
  );

  return current > session.expiresAt || current > inactivityDeadline;
};

export class SessionService {
  static async createSession(
    user: Pick<User, "id" | "role">,
    ipAddress?: string,
    userAgent?: string,
  ) {
    await this.enforceConcurrentSessionLimit(user.id);

    const sessionId = generateSecureToken(32);
    const issuedAt = now();
    const expiresAt = addMinutes(issuedAt, SESSION_MAX_LIFETIME_MINUTES);

    await UserSession.create({
      userId: user.id,
      sessionId,
      issuedAt,
      lastActivityAt: issuedAt,
      expiresAt,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
    });

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        sessionId,
        tokenType: JWT_TOKEN_TYPE,
      } as SessionTokenPayload,
      JWT_SECRET,
      {
        expiresIn: `${SESSION_MAX_LIFETIME_MINUTES}m`,
        jwtid: sessionId,
        algorithm: ALLOWED_JWT_ALGORITHMS[0],
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
        header: { alg: ALLOWED_JWT_ALGORITHMS[0], typ: "JWT" },
      } as jwt.SignOptions,
    );

    return { token, sessionId, expiresAt };
  }

  static async verifySessionToken(token: string) {
    return this.verifySessionTokenWithContext(token);
  }

  static async verifySessionTokenWithContext(
    token: string,
    context?: { ipAddress?: string; userAgent?: string },
  ) {
    assertTrustedJwtStructure(token);

    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ALLOWED_JWT_ALGORITHMS as unknown as jwt.Algorithm[],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    }) as SessionTokenPayload;

    if (
      !decoded.id ||
      !decoded.role ||
      !decoded.sessionId ||
      decoded.tokenType !== JWT_TOKEN_TYPE ||
      decoded.iss !== JWT_ISSUER ||
      decoded.aud !== JWT_AUDIENCE
    ) {
      throw new Error("Token inválido");
    }

    const session = await UserSession.findOne({
      where: { sessionId: decoded.sessionId, userId: decoded.id },
    });

    if (!session || session.revokedAt) {
      throw new Error("Token inválido ou expirado");
    }

    if (isSessionExpired(session as ActiveSession)) {
      await this.revokeSession(session.sessionId, "Sessão expirada.");
      throw new Error("Token inválido ou expirado");
    }

    if (
      process.env.NODE_ENV !== "test" &&
      ((context?.ipAddress &&
        session.ipAddress &&
        context.ipAddress !== session.ipAddress) ||
        (context?.userAgent &&
          session.userAgent &&
          context.userAgent !== session.userAgent))
    ) {
      await this.revokeSession(
        session.sessionId,
        "Alteração contextual detetada durante a sessão.",
      );
      throw new Error("Token inválido ou expirado");
    }

    const user = await User.findByPk(decoded.id);
    if (!user || user.status === "disabled") {
      await this.terminateAllSessionsForUser(decoded.id, "Conta desativada.");
      throw new Error("Token inválido ou expirado");
    }

    session.lastActivityAt = now();
    await session.save();

    return {
      user: {
        id: decoded.id,
        role: user.role,
      },
      sessionId: decoded.sessionId,
      session,
    };
  }

  static async revokeSession(sessionId: string, reason: string) {
    const session = await UserSession.findOne({ where: { sessionId } });

    if (!session || session.revokedAt) {
      return null;
    }

    session.revokedAt = now();
    session.revokedReason = reason;
    await session.save();

    return session;
  }

  static async terminateCurrentSession(sessionId?: string, reason = "Logout") {
    if (!sessionId) {
      return null;
    }

    return this.revokeSession(sessionId, reason);
  }

  static async terminateAllSessionsForUser(userId: number, reason: string) {
    await UserSession.update(
      {
        revokedAt: now(),
        revokedReason: reason,
      },
      {
        where: {
          userId,
          revokedAt: null,
        },
      },
    );
  }

  static async terminateAllSessionsGlobally(reason: string) {
    await UserSession.update(
      {
        revokedAt: now(),
        revokedReason: reason,
      },
      {
        where: {
          revokedAt: null,
        },
      },
    );
  }

  static async terminateOtherSessionsForUser(
    userId: number,
    currentSessionId: string,
    reason: string,
  ) {
    await UserSession.update(
      {
        revokedAt: now(),
        revokedReason: reason,
      },
      {
        where: {
          userId,
          sessionId: { [Op.ne]: currentSessionId },
          revokedAt: null,
        },
      },
    );
  }

  static async listActiveSessionsForUser(userId: number) {
    const sessions = await UserSession.findAll({
      where: {
        userId,
        revokedAt: null,
        expiresAt: { [Op.gt]: now() },
      },
      order: [["lastActivityAt", "DESC"]],
    });

    return sessions.filter(
      (session) => !isSessionExpired(session as ActiveSession),
    );
  }

  static async terminateSessionForUser(userId: number, sessionId: string) {
    const session = await UserSession.findOne({ where: { userId, sessionId } });

    if (!session) {
      throw new Error("Sessão não encontrada.");
    }

    await this.revokeSession(sessionId, "Sessão terminada pelo utilizador.");
    return session;
  }

  static async terminateAllOtherSessionsOnRotation(
    userId: number,
    currentSessionId: string,
  ) {
    await this.terminateOtherSessionsForUser(
      userId,
      currentSessionId,
      "Sessões antigas terminadas após renovação de autenticação.",
    );
  }

  private static async enforceConcurrentSessionLimit(userId: number) {
    const sessions = await this.listActiveSessionsForUser(userId);

    if (sessions.length < MAX_CONCURRENT_SESSIONS) {
      return;
    }

    const overflow = sessions
      .sort(
        (left, right) =>
          new Date(left.lastActivityAt).getTime() -
          new Date(right.lastActivityAt).getTime(),
      )
      .slice(0, sessions.length - MAX_CONCURRENT_SESSIONS + 1);

    for (const session of overflow) {
      await this.revokeSession(
        session.sessionId,
        "Limite de sessões ativas atingido.",
      );
    }
  }
}
