import crypto from "crypto";

export const MIN_PASSWORD_LENGTH = 8;

export const PASSWORD_CONTEXT_WORDS = [
  "cantinasapp",
  "cantina",
  "canteen",
  "refeitorio",
  "refectory",
  "desofs2026",
  "ffs",
  "thu",
  "biocantina",
  "project",
  "student",
  "visitor",
  "supplier",
  "nutritionist",
  "networkmanager",
  "stockmanager",
  "canteenmanager",
  "refectorymanager",
  "refectorystaff",
];

// OWASP top 100+ most common passwords and variations
const COMMON_PASSWORDS = new Set([
  "123456",
  "12345678",
  "123456789",
  "password",
  "password1",
  "password12",
  "password123",
  "qwerty",
  "qwerty123",
  "qwerty12345",
  "admin",
  "admin123",
  "administrator",
  "root",
  "letmein",
  "welcome",
  "welcome1",
  "iloveyou",
  "abc123",
  "abc123456",
  "111111",
  "1111",
  "11111",
  "123123",
  "1234567",
  "12345",
  "000000",
  "123qwe",
  "senha",
  "senha123",
  "cantinasapp",
  "biocantina",
  "desofs2026",
  "thu",
  "ffs",
  "monkey",
  "dragon",
  "master",
  "sunshine",
  "princess",
  "shadow",
  "123456a",
  "12345678a",
  "pass",
  "pass123",
  "pass@word",
  "password@123",
  "pass1234",
  "pass12345",
  "user",
  "username",
  "test",
  "test123",
  "demo",
  "demo123",
  "guest",
  "login",
  "secure",
  "secret",
  "secret123",
  "freedom",
  "football",
  "baseball",
  "soccer",
  "summer",
  "winter",
  "spring",
  "flower",
  "coffee",
  "cheese",
  "pizza",
  "banana",
  "orange",
  "hello",
  "world",
  "helloworld",
  "abc",
  "xyz",
  "789",
  "999",
  "000",
  "qwerty1",
  "admin1",
  "administrator1",
  "root1",
  "letmein1",
  "welcome123",
  "iloveyou1",
  "password!",
  "password@",
  "password#",
]);

type PasswordPolicyContext = {
  name?: string;
  email?: string;
  role?: string;
};

const normalize = (value: string) => value.toLowerCase();

const BREACHED_PASSWORD_CACHE = new Map<string, boolean>();

const BREACHED_PASSWORD_KDF_SALT = "cantinasapp-breached-password-check";
const BREACHED_PASSWORD_KDF_ITERATIONS = 210000;
const BREACHED_PASSWORD_KDF_KEYLEN = 32;
const BREACHED_PASSWORD_KDF_DIGEST = "sha256";

const deriveBreachedPasswordHex = (value: string) => {
  return crypto
    .pbkdf2Sync(
      value,
      BREACHED_PASSWORD_KDF_SALT,
      BREACHED_PASSWORD_KDF_ITERATIONS,
      BREACHED_PASSWORD_KDF_KEYLEN,
      BREACHED_PASSWORD_KDF_DIGEST,
    )
    .toString("hex");
};

export const isBreachedPassword = async (password: string) => {
  const normalizedPassword = normalize(password);

  if (BREACHED_PASSWORD_CACHE.has(normalizedPassword)) {
    return BREACHED_PASSWORD_CACHE.get(normalizedPassword) as boolean;
  }

  // During unit tests we skip external HIBP checks only when `fetch` is not available
  // This allows tests to mock `global.fetch` and exercise the breached-password logic.
  if (
    process.env.NODE_ENV === "test" &&
    typeof globalThis.fetch === "undefined"
  ) {
    BREACHED_PASSWORD_CACHE.set(normalizedPassword, false);
    return false;
  }

  const hash = deriveBreachedPasswordHex(password).toUpperCase();
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  const response = await fetch(
    `https://api.pwnedpasswords.com/range/${prefix}`,
    {
      headers: {
        "Add-Padding": "true",
        "User-Agent": "CantinasApp-Backend",
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      "Não foi possível verificar a password contra a lista comprometida.",
    );
  }

  const body = await response.text();
  const breached = body
    .split("\n")
    .some((line) => line.split(":")[0]?.trim().toUpperCase() === suffix);

  BREACHED_PASSWORD_CACHE.set(normalizedPassword, breached);
  return breached;
};

export const getPasswordPolicyIssues = (
  password: string,
  context: PasswordPolicyContext = {},
) => {
  const issues: string[] = [];
  const normalizedPassword = normalize(password);
  const contextWords = [
    ...PASSWORD_CONTEXT_WORDS,
    ...(context.name ? [context.name] : []),
    ...(context.email ? [context.email] : []),
    ...(context.role ? [context.role] : []),
  ]
    .map(normalize)
    .filter(
      (word, index, array) => word.length > 2 && array.indexOf(word) === index,
    );

  if (password.length < MIN_PASSWORD_LENGTH) {
    issues.push(
      `A password deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`,
    );
  }

  if (normalizedPassword.length === 0) {
    issues.push("A password não pode estar vazia.");
  }

  if (COMMON_PASSWORDS.has(normalizedPassword)) {
    issues.push("A password é demasiado comum.");
  }

  if (contextWords.some((word) => normalizedPassword.includes(word))) {
    issues.push(
      "A password não pode conter palavras contextuais da aplicação.",
    );
  }

  return issues;
};

export const assertPasswordPolicy = (
  password: string,
  context: PasswordPolicyContext = {},
) => {
  const issues = getPasswordPolicyIssues(password, context);

  if (issues.length > 0) {
    throw new Error(issues.join(" "));
  }
};

export const assertPasswordPolicyAsync = async (
  password: string,
  context: PasswordPolicyContext = {},
) => {
  const issues = getPasswordPolicyIssues(password, context);

  if (await isBreachedPassword(password)) {
    issues.push(
      "A password foi encontrada numa lista de passwords comprometidas.",
    );
  }

  if (issues.length > 0) {
    throw new Error(issues.join(" "));
  }
};
