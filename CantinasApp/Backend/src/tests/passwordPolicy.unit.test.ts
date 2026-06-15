import {
  getPasswordPolicyIssues,
  assertPasswordPolicy,
  assertPasswordPolicyAsync,
  isBreachedPassword,
  MIN_PASSWORD_LENGTH,
} from "../utils/passwordPolicy";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
});

describe("passwordPolicy", () => {
  it("accepts a long password without composition rules", () => {
    expect(getPasswordPolicyIssues("abcDEF123!@#xyzQ")).toEqual([]);
    expect(() => assertPasswordPolicy("abcDEF123!@#xyzQ")).not.toThrow();
  });

  it("rejects passwords shorter than the minimum length", () => {
    const issues = getPasswordPolicyIssues("short");

    expect(MIN_PASSWORD_LENGTH).toBe(8);
    expect(issues).toContain("A password deve ter pelo menos 8 caracteres.");
  });

  it("rejects common passwords", () => {
    expect(getPasswordPolicyIssues("123456")).toContain(
      "A password é demasiado comum.",
    );
  });

  it("rejects context-specific words", () => {
    expect(
      getPasswordPolicyIssues("CantinasApp-Seed-2026!", {
        name: "Demo User",
        role: "Student",
      }),
    ).toContain(
      "A password não pode conter palavras contextuais da aplicação.",
    );
  });

  it("rejects breached passwords via the async policy check", async () => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      text: async () =>
        "6275331B4C147D57809B2CF7079F39187382F7E35E743BBA8F1CD149B4E:1",
    })) as any;

    await expect(isBreachedPassword("password")).resolves.toBe(true);
    await expect(assertPasswordPolicyAsync("password")).rejects.toThrow(
      "A password é demasiado comum. A password foi encontrada numa lista de passwords comprometidas.",
    );
  });
});
