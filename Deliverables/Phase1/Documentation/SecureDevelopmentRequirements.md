# Secure Development Requirements - Phase 1

## 1. Purpose

This document defines the secure development requirements that the CantinasApp team will follow during the implementation, testing, and delivery of the system.

These are different from the product's security requirements (see [SecurityRequirements.md](SecurityRequirements.md), SR-01 to SR-10), which describe what the software must do. The requirements here describe **how the team works** so that security is built in from the start and not added to the debt later to be solved.

## 2. Principles

- Shift-left: security activities happen as early as possible in the SSDLC.
- Defense in depth: multiple controls so that one failure does not expose the system.
- Least privilege: for users, tokens, database accounts, and CI credentials.
- Repeatability: the same action, done by different people, should produce the same security outcome.
- Traceability: every security decision should be linked to a threat, requirement, or test.

## 3. Secure Development Requirements

| ID     | Requirement                                                                                  | Category                | Linked Artifacts |
| ------ | -------------------------------------------------------------------------------------------- | ----------------------- | ---------------- |
| SDR-01 | All work happens in feature branches; `main` is protected and requires pull requests to merge. | Version Control         | Section 5        |
| SDR-02 | Every pull request must be reviewed and approved by at least one team member other than the author. | Code Review         | Section 6        |
| SDR-03 | No secrets, tokens, passwords, or private keys are committed to the repository. | Secrets Management       | Section 7        |
| SDR-04 | Sensitive configuration is loaded from environment variables and documented in `.env.example`. | Secrets Management    | Section 7        |
| SDR-05 | Code must follow the team's secure coding guidelines, aligned with OWASP Secure Coding Practices. | Secure Coding        | Section 8        |
| SDR-06 | Input validation and output encoding are required for all external inputs. | Secure Coding              | Section 8, SR-03 |
| SDR-07 | Dependencies must be installed from official sources; suspicious or unmaintained libraries are rejected. | Supply Chain   | Section 9, SR-09 |
| SDR-08 | Dependency vulnerability scans must be executed periodically and before every release. | Supply Chain           | Section 9, SR-09 |
| SDR-09 | Tests must pass before a pull request is merged. | Quality Gates                                          | Section 10       |
| SDR-10 | Static code analysis (SAST) must run on every pull request | Quality Gates     | Section 10, ST-10 |
| SDR-11 | A Definition of Done including security criteria must be applied to every user story or task. | Process                  | Section 11       |
| SDR-12 | Threat model, risk assessment, and ASVS checklist are reviewed before every sprint submission. | Process                 | Section 12, [SecurityTesting.md](SecurityTesting.md) |
| SDR-13 | All team members must be aware of the OWASP Top 10 and the main threats identified in the project threat model. | Training        | Section 13       |

## 4. Branching and Version Control

- Default branch: `main`. It is considered the source of truth and must always be deployable.
- Feature branches follow the naming convention `feature/<short-description>` or `fix/<short-description>`.
- Commits should be small, focused, and have descriptive messages.
- Direct pushes to `main` are not allowed; changes go through pull requests.
- Branch protection rules on `main`:
  - Require at least one approving review.
  - Require status checks to pass (tests, lint, SAST once available).
  - Require the branch to be up to date before merging.
- Administrator access to the repository is granted to the PL instructor (ffs@isep.ipp.pt).

## 5. Code Review Policy

- Every pull request is reviewed by at least one team member other than the author.
- The reviewer checks:
  - Correctness of the change versus the linked task or issue.
  - Coverage of basic security concerns relevant to the change (auth, authorization, input validation, error handling, logging).
  - No secrets, credentials, or sensitive data are included.
  - Tests exist or are updated for the change when applicable.
- Changes that touch authentication, authorization, file handling, or database access require extra attention and should be reviewed with the threat model in mind.
- Review comments are resolved before merging; "Approved with comments" is not enough when comments are security-relevant.

## 6. Secrets Management

- Secrets are never committed. This includes: JWT secrets, database passwords, API keys, SMTP credentials, and third-party tokens.
- `.env` files are ignored via `.gitignore`.
- The repository provides a `.env.example` file describing the expected variables without real values.
- Local development uses personal `.env` files.
- Production/staging secrets are managed through environment variables in the deployment environment.
- If a secret is committed by accident, it must be considered compromised, rotated, and the commit history cleaned before the next release.

## 7. Secure Coding Guidelines

The team follows the OWASP Secure Coding Practices checklist. The main rules adopted for this project are:

- Validate and sanitize all external input (body, params, query, headers, files).
- Use parameterized queries or ORM features (Sequelize) and never build SQL by string concatenation.
- Hash passwords using bcrypt with an appropriate cost factor.
- Use JWT only for authentication, with expiration and signature verification.
- Enforce authorization checks at the controller/service layer, not only at the route layer.
- Apply output encoding where responses include user-controlled data.
- Avoid leaking stack traces or internal errors in API responses.
- Log security-relevant events (login success/failure, permission denied, file upload rejections) without logging passwords or tokens.
- Use HTTPS/TLS for all external communication.
- Use secure defaults: deny by default, explicit allow.
- Handle file uploads with type, size, and content checks.

## 8. Dependency Management

- New dependencies are added only when there is a clear need and no reasonable in-house alternative.
- Before adopting a library, the team checks:
  - Maintenance status (recent commits, open issues).
  - Known vulnerabilities.
  - License compatibility.
- `npm audit` is run locally before opening a pull request that changes dependencies.
- Transitive vulnerabilities are triaged; critical and high-severity issues block the release.

## 9. Quality Gates

Before a pull request can be merged:

- All automated tests must pass.
- Linter must pass.
- The following additional checks must pass:
  - SAST scan.
  - SCA scan (for example, `npm audit`).
  - Build must succeed on the target platform.

Releases are cut from `main` only after:

- All Phase checks are green.
- ASVS checklist is reviewed and updated.
- Threat model review is executed.

## 10. Definition of Done

A task, user story, or feature is considered Done when all of the following are true:

- Functional acceptance criteria are met.
- Code is reviewed and approved by at least one other team member.
- Unit/integration tests exist and pass for the new/changed behavior.
- No new critical/high SAST or SCA findings are introduced (checked once pipeline is active).
- New inputs or endpoints have validation and authorization applied.
- New sensitive actions are logged.
- Documentation (API, threat model, ASVS) is updated if the change affects the architecture or trust boundaries.
- No secrets are committed.

## 11. Threat Model and ASVS Review

- The threat model ([threat-analysis.md](threat-analysis.md)) and ASVS checklist ([../ASVS-Phase1.md](../ASVS-Phase1.md)) are reviewed:
  - Before each sprint submission.
  - When a new major endpoint or trust boundary is introduced.
  - When a new aggregate or external integration is added.
- The review updates:
  - DFDs
  - STRIDE coverage
  - Misuse/abuse cases
  - Risk ranking
  - Mitigations
  - ASVS status
  - Traceability matrix

## 12. Tooling (planned and adopted)

| Purpose                  | Tool (planned/adopted)                                   | Status              |
| ------------------------ | -------------------------------------------------------- | ------------------- |
| Version control          | Git + remote repository                                  | Adopted             |
| Branch protection        | Remote repo settings on `main`                           | To be configured    |
| Password hashing         | bcrypt                                                   | Adopted             |
| Input validation         | Joi                                                      | Adopted             |
| Auth middleware          | jsonwebtoken + custom middlewares                        | Adopted             |
| Linting                  | ESLint                                                   | To be added         |
| SAST                     | Semgrep or SonarCloud                                    | Planned for Phase 2 |
| SCA                      | `npm audit`, Dependabot (or Snyk)                        | Planned for Phase 2 |
| DAST                     | OWASP ZAP                                                | Planned for Phase 2 |
| Secret scanning          | Gitleaks (or equivalent)                                 | Planned for Phase 2 |
| Pipeline                 | GitHub Actions (or equivalent)                           | Planned for Phase 2 |
