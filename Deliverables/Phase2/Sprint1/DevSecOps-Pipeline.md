# DevSecOps Pipeline – Sprint 1

## Purpose

This document describes the CI/CD security pipeline established in Sprint 1 for the CantinasApp backend. The pipeline enforces security checks automatically on every push and pull request, implementing the quality gates defined in Phase 1 (SDR-10) and supporting the secure development requirements (SDR-02 through SDR-10).

---

## Pipeline Architecture

**File:** [.github/workflows/security-pipeline.yml](../../../.github/workflows/security-pipeline.yml)

**Triggers:**
- `push` to `main` or `develop` branches
- `pull_request` targeting `main` or `develop` branches

**Jobs (run in parallel after `build`):**

```
push / PR
    │
    ▼
[build] ── TypeScript compile (npm ci + tsc)
    │
    ├──▶ [sast-eslint]   ESLint + eslint-plugin-security
    ├──▶ [sca-npm-audit]  npm audit (fail on HIGH/CRITICAL)
    └──▶ [sast-semgrep]  Semgrep (config: auto)
```

| Job | Tool | Purpose | Fail Condition |
|-----|------|---------|---------------|
| `build` | TypeScript compiler | Ensures code compiles before analysis | Compilation errors |
| `sast-eslint` | ESLint 8 + eslint-plugin-security | Static analysis for security anti-patterns | Report only (warnings uploaded as artifact) |
| `sca-npm-audit` | npm audit | Known CVEs in production dependencies | HIGH or CRITICAL vulnerabilities |
| `sast-semgrep` | Semgrep (auto ruleset) | Deep semantic SAST across OWASP patterns | Report only (uploaded as artifact) |

All jobs upload their reports as **GitHub Actions artifacts** (30-day retention), providing traceable evidence for assessments.

---

## Tools: Selection Rationale

### ESLint + eslint-plugin-security
- **Why:** Native to the Node.js/TypeScript ecosystem; zero extra infrastructure; catches security anti-patterns (non-literal fs paths, object injection, unsafe regex, eval) directly in the IDE during development
- **Config:** [`CantinasApp/Backend/.eslintrc.json`](../../../CantinasApp/Backend/.eslintrc.json)
- **Rules enabled:** `detect-non-literal-fs-filename`, `detect-object-injection`, `detect-unsafe-regex`, `detect-child-process`, `detect-eval-with-expression`, `detect-pseudoRandomBytes`, and others
- **Traceability:** SR-03 (input validation), SR-04 (upload restrictions), TH-T-01, TH-T-02

### npm audit
- **Why:** Built into Node.js toolchain; queries the GitHub Advisory Database for known CVEs in installed packages; zero additional cost
- **Severity threshold:** Pipeline fails on `--audit-level=high` (HIGH and CRITICAL only) using `--production` flag to exclude dev-only packages from the gate
- **Traceability:** SR-09 (dependency management), ST-10, TH-T-03

### Semgrep
- **Why:** Semantic code analysis with a large open-source ruleset covering OWASP Top 10, injection, crypto misuse, and Express.js-specific patterns; runs in a container without credentials
- **Config:** `--config=auto` (pulls community rules for JavaScript/TypeScript)
- **Traceability:** SR-03, SR-04, TH-T-01, TH-T-02

### GitHub Dependabot
- **File:** [.github/dependabot.yml](../../../.github/dependabot.yml)
- **Why:** Automated weekly PRs to update npm dependencies in `/CantinasApp/Backend`; each PR triggers the pipeline so updates are validated before merge
- **Traceability:** SDR-05 (dependency hygiene), SR-09

---

## Security Requirements Coverage

| Security Requirement | Pipeline Enforcement |
|----------------------|---------------------|
| SR-03: Input validation/sanitization | ESLint (`no-eval`, `detect-eval-with-expression`) |
| SR-04: Upload restrictions | ESLint (`detect-non-literal-fs-filename`) |
| SR-08: Service resilience | ESLint (`detect-unsafe-regex` — ReDoS prevention) |
| SR-09: Dependency vulnerability management | npm audit (blocks HIGH+); Dependabot (automated updates) |
| SDR-04: Secure coding guidelines | ESLint enforces TypeScript strict + security rules |
| SDR-05: Dependency hygiene | Dependabot + npm audit |
| SDR-10: Quality gates | Pipeline blocks merges on HIGH vulnerabilities |

---

## Evidence

The pipeline produces the following artifacts on every run:

| Artifact Name | Contents |
|---------------|----------|
| `eslint-sast-report` | JSON report with all ESLint findings per file |
| `sca-npm-audit-report` | JSON report with all CVE findings |
| `semgrep-sast-report` | JSON report with all Semgrep findings |

These artifacts are downloadable from the GitHub Actions run page and serve as documented evidence for the ASVS assessment and security testing traceability matrix.
