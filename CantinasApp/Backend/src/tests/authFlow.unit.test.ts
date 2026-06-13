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
    // Create a test user
    testUser = await UserService.createUser(
      "Test User",
      testEmail,
      testPassword,
      "Student",
    );
  });

  afterAll(async () => {
    // Clean up
    if (testUser) {
      await User.destroy({ where: { id: testUser.id } });
    }
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
