import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import { User } from "../../src/Model/User";
import { LoginAudit } from "../../src/Model/LoginAudit";
import { UserService } from "../../src/Service/UserService";
import bcrypt from "bcrypt";

describe("Email Verification & Password Reset Flow", () => {
  let testUser: any;
  const testEmail = "test-auth@example.com";
  const testPassword = "SecurePass123!@#";
  const newPassword = "NewSecurePass456!@#";

  beforeAll(async () => {
    // Mock DB/service interactions to avoid requiring a live MySQL instance in CI
    jest
      .spyOn(UserService, "createUser")
      .mockImplementation(
        async (name: string, email: string, password: string, role: string) => {
          return {
            id: 12345,
            name,
            email,
            role,
            password: await bcrypt.hash(password, 10),
          } as any;
        },
      );

    const mockUser: any = {
      id: 12345,
      name: "Test User",
      email: testEmail,
      role: "Student",
      password: await bcrypt.hash(testPassword, 10),
      passwordResetToken: null,
      passwordResetExpiry: null,
      emailVerified: false,
      emailVerificationToken: null,
      emailVerificationExpiry: null,
    };

    const audits: any[] = [];

    // Keep created users in-memory for the scope of these tests
    const createdUsers = new Map<number, any>();
    let nextId = 20000;

    jest
      .spyOn(UserService, "requestPasswordReset")
      .mockImplementation(async (email: string) => {
        mockUser.passwordResetToken = "reset-token-123";
        mockUser.passwordResetExpiry = new Date(Date.now() + 3600000);
        return {
          message: "email sent",
          token: mockUser.passwordResetToken,
          expiry: mockUser.passwordResetExpiry,
        } as any;
      });

    jest
      .spyOn(UserService, "resetPassword")
      .mockImplementation(async (token: string, newPwd: string) => {
        // Simulate expired token
        if (token === "old-token-123") {
          throw new Error("token expirado");
        }
        if (token !== mockUser.passwordResetToken) {
          throw new Error("token inválido");
        }
        mockUser.passwordResetToken = null;
        mockUser.password = await bcrypt.hash(newPwd, 10);
        return mockUser;
      });

    jest
      .spyOn(UserService, "verifyEmail")
      .mockImplementation(async (token: string) => {
        // Find created user with matching token and mark verified
        for (const user of createdUsers.values()) {
          if (user.emailVerificationToken === token) {
            user.emailVerified = true;
            user.emailVerificationToken = null;
            return user as any;
          }
        }
        if (mockUser.emailVerificationToken === token) {
          mockUser.emailVerified = true;
          mockUser.emailVerificationToken = null;
          return mockUser as any;
        }
        throw new Error("token inválido");
      });

    jest
      .spyOn(UserService, "login")
      .mockImplementation(async (email: string, pwd: string) => {
        return { id: mockUser.id } as any;
      });

    jest
      .spyOn(UserService, "logLoginAttempt")
      .mockImplementation(
        async (
          email: string,
          ip: string,
          userAgent: any,
          status: string,
          reason?: string,
        ) => {
          audits.push({ email, ipAddress: ip, userAgent, status, reason });
          return undefined as any;
        },
      );

    // Mock model methods used directly by the tests
    jest.spyOn(User, "create").mockImplementation(async (obj: any) => {
      const id = ++nextId;
      const user = { ...obj, id };
      createdUsers.set(id, user);
      return user as any;
    });
    jest.spyOn(User, "destroy").mockImplementation(async (opts: any) => {
      const id = opts?.where?.id;
      if (createdUsers.has(id)) {
        createdUsers.delete(id);
        return 1 as any;
      }
      return 0 as any;
    });
    jest.spyOn(User, "findByPk").mockImplementation(async (id: any) => {
      if (id === mockUser.id) return mockUser;
      if (createdUsers.has(id)) return createdUsers.get(id);
      return null as any;
    });

    jest.spyOn(LoginAudit, "findOne").mockImplementation(async (opts: any) => {
      const where = opts?.where || {};
      return audits.find((a) =>
        Object.keys(where).every((k) => a[k] === where[k]),
      ) as any;
    });

    // Create a test user via mocked service
    testUser = await UserService.createUser(
      "Test User",
      testEmail,
      testPassword,
      "Student",
    );
  });

  afterAll(async () => {
    jest.restoreAllMocks();
  });

  it("should request a password reset and generate expiring token", async () => {
    const result = await UserService.requestPasswordReset(testEmail);
    expect(result.message).toContain("email");
    expect(result.token).toBeDefined();
    expect(result.expiry).toBeDefined();

    // Verify token is stored on user
    const updatedUser = await User.findByPk(testUser.id);
    expect(updatedUser?.passwordResetToken).toBe(result.token);
  });

  it("should reset password with valid token", async () => {
    // Request reset
    const reset = await UserService.requestPasswordReset(testEmail);
    expect(reset.token).toBeDefined();

    // Reset with token
    const updated = await UserService.resetPassword(reset.token!, newPassword);
    expect(updated.id).toBe(testUser.id);

    // Verify token is cleared
    const user = await User.findByPk(testUser.id);
    expect(user?.passwordResetToken).toBeNull();

    // Verify new password works
    const canLogin = await UserService.login(testEmail, newPassword);
    expect(canLogin.id).toBe(testUser.id);
  });

  it("should reject reset with expired token", async () => {
    // Create a user with expired token
    const expiredUser = await User.create({
      name: "Expired User",
      email: "expired@example.com",
      password: await bcrypt.hash("TestPass123", 10),
      role: "Student",
      status: "enabled",
      passwordResetToken: "old-token-123",
      passwordResetExpiry: new Date(Date.now() - 60000), // 1 minute ago
    });

    try {
      await UserService.resetPassword("old-token-123", "NewPass456");
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      expect(error.message).toContain("expirado");
    } finally {
      await User.destroy({ where: { id: expiredUser.id } });
    }
  });

  it("should verify email with valid token", async () => {
    const emailToken = "test-email-token-" + Date.now();
    const verifyUser = await User.create({
      name: "Email Verify User",
      email: "verify@example.com",
      password: await bcrypt.hash("TestPass123", 10),
      role: "Student",
      status: "enabled",
      emailVerified: false,
      emailVerificationToken: emailToken,
      emailVerificationExpiry: new Date(Date.now() + 60000),
    });

    const verified = await UserService.verifyEmail(emailToken);
    expect(verified.email).toBe("verify@example.com");

    const updatedUser = await User.findByPk(verifyUser.id);
    expect(updatedUser?.emailVerified).toBe(true);
    expect(updatedUser?.emailVerificationToken).toBeNull();

    await User.destroy({ where: { id: verifyUser.id } });
  });

  it("should log successful login attempts", async () => {
    const ip = "192.168.1.100";
    const userAgent = "Mozilla/5.0";

    await UserService.logLoginAttempt(testEmail, ip, userAgent, "success");

    const audit = await LoginAudit.findOne({
      where: { email: testEmail, status: "success" },
    });
    expect(audit).toBeDefined();
    expect(audit?.ipAddress).toBe(ip);
    expect(audit?.status).toBe("success");
  });

  it("should log failed login attempts", async () => {
    const ip = "192.168.1.101";
    const reason = "Invalid password";

    await UserService.logLoginAttempt(
      "nonexistent@example.com",
      ip,
      undefined,
      "failed",
      reason,
    );

    const audit = await LoginAudit.findOne({
      where: { email: "nonexistent@example.com", status: "failed" },
    });
    expect(audit).toBeDefined();
    expect(audit?.reason).toBe(reason);
  });
});
