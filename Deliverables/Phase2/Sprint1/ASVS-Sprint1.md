# ASVS Checklist – Phase 2 Sprint 1 (ASVS 5.0)

**Sprint:** Phase 2 – Sprint 1  
**Date:** 2026-05-09  
**Base:** Carries forward from [ASVS-Phase1.md](../../Phase1/ASVS-Phase1.md)

Status values: `Not Started` | `In Progress` | `Compliant` | `Not Applicable`

Sprint 1 updates are marked with **[Sprint 1]** in the Observations column.

---

## Checklist

| Section ID | Section Name | Req ID | Description | Level | Status | Observations | Reference/Link |
|------------|-------------|--------|-------------|-------|--------|--------------|----------------|
| V1 | Encoding and Sanitization | V1-REQ-01 | Define input sanitization and normalization rules for all untrusted fields. | L1 | In Progress | Joi schemas in place for key endpoints. ESLint SAST scan identified `any` type usage in controllers that weakens type-safe validation. **[Sprint 1]** ESLint scan run; findings documented in SAST-Report.md. | [SR-03](../../Phase1/Documentation/SecurityRequirements.md), [ST-03](../../Phase1/Documentation/SecurityTesting.md), [SAST-Report.md](SAST-Report.md) |
| V1 | Encoding and Sanitization | V1-REQ-02 | Define output encoding requirements for data rendered or exported to clients. | L1 | Not Started | Planned for implementation hardening in Sprint 2. | Deferred to Sprint 2 |
| V2 | Validation and Business Logic | V2-REQ-01 | Define input validation controls before business logic and persistence. | L1 | In Progress | Joi validation active. `sequelize@6.37.7` has a SQL Injection CVE (GHSA-6457-6jrx-69cr) — upgrade required. **[Sprint 1]** CVE documented in SCA-Report.md. | [SR-03](../../Phase1/Documentation/SecurityRequirements.md), [SCA-Report.md](SCA-Report.md) |
| V2 | Validation and Business Logic | V2-REQ-02 | Define abuse-resistant constraints for high-value workflows. | L1 | In Progress | Abuse cases documented; implementation enforcement pending. | [AbuseCases.md](../../Phase1/Documentation/AbuseCases.md) |
| V3 | Web Frontend Security | V3-REQ-01 | Define browser/frontend security requirements for client-side attack reduction. | L1 | Not Started | Frontend hardening deferred to Sprint 2. | Deferred to Sprint 2 |
| V4 | API and Web Service | V4-REQ-01 | Define API authorization and access checks for privileged operations. | L1 | In Progress | JWT auth and role middleware in place. Test execution pending. | [SR-01](../../Phase1/Documentation/SecurityRequirements.md), [SR-02](../../Phase1/Documentation/SecurityRequirements.md) |
| V4 | API and Web Service | V4-REQ-02 | Define secure API response behavior to reduce unnecessary data exposure. | L1 | In Progress | Addressed through SR-06; implementation verification pending. | [SR-06](../../Phase1/Documentation/SecurityRequirements.md) |
| V5 | File Handling | V5-REQ-01 | Define file type and upload size restrictions. | L1 | In Progress | Multer configured. **[Sprint 1]** SAST finding SF-01 (detect-non-literal-fs-filename) in ApplicationController.ts:161,193 — path traversal risk identified; remediation pending. | [SR-04](../../Phase1/Documentation/SecurityRequirements.md), [SAST-Report.md](SAST-Report.md) |
| V5 | File Handling | V5-REQ-02 | Define secure file retrieval and document access authorization rules. | L1 | In Progress | Mapped to predictable URL disclosure scenario. | [SR-05](../../Phase1/Documentation/SecurityRequirements.md) |
| V6 | Authentication | V6-REQ-01 | Define authentication requirements for sensitive endpoints. | L1 | In Progress | JWT authentication middleware implemented. Test execution pending. | [SR-01](../../Phase1/Documentation/SecurityRequirements.md) |
| V6 | Authentication | V6-REQ-02 | Define credential and identity assurance baseline for privileged users. | L1 | In Progress | bcrypt password hashing in place. | [SR-01](../../Phase1/Documentation/SecurityRequirements.md) |
| V7 | Session Management | V7-REQ-01 | Define session timeout and invalidation requirements. | L1 | Not Started | Planned for Sprint 2. | Deferred to Sprint 2 |
| V8 | Authorization | V8-REQ-01 | Define role-based authorization model for all protected operations. | L1 | In Progress | `authorizeRoles.ts` middleware implemented. Test execution pending. | [SR-02](../../Phase1/Documentation/SecurityRequirements.md) |
| V8 | Authorization | V8-REQ-02 | Define least-privilege rules and privileged action constraints. | L1 | In Progress | Role definitions documented; verification pending. | [SR-02](../../Phase1/Documentation/SecurityRequirements.md) |
| V9 | Self-contained Tokens | V9-REQ-01 | Define token claim validation and token misuse protections. | L1 | In Progress | JWT validation in authMiddleware.ts. **[Sprint 1]** SAST found `any` type in authMiddleware.ts — reduces type safety for token claims. | [SR-01](../../Phase1/Documentation/SecurityRequirements.md), [SAST-Report.md](SAST-Report.md) |
| V10 | OAuth and OIDC | V10-REQ-01 | Define OAuth/OIDC controls when delegated identity is used. | L1 | Not Applicable | No OAuth/OIDC in scope. | N/A |
| V11 | Cryptography | V11-REQ-01 | Define data-at-rest protection requirements for sensitive data. | L1 | In Progress | Encryption at rest documented in mitigations. Implementation pending. | [SR-06](../../Phase1/Documentation/SecurityRequirements.md) |
| V12 | Secure Communication | V12-REQ-01 | Define data-in-transit protection requirements. | L1 | In Progress | HTTPS/TLS requirement documented. Configuration verification pending. | [SR-06](../../Phase1/Documentation/SecurityRequirements.md) |
| V13 | Configuration | V13-REQ-01 | Define secure configuration baseline and validation process. | L1 | Not Started | Planned as part of Sprint 2 hardening. | Deferred to Sprint 2 |
| V13 | Configuration | V13-REQ-02 | Define dependency and configuration hygiene controls for third-party components. | L1 | **Compliant** | **[Sprint 1]** npm audit executed (33 vulnerabilities found; 1 critical, 8 high documented). SCA pipeline job (`sca-npm-audit`) runs on every PR and fails on HIGH+. Dependabot configured for weekly automated PRs. Evidence: SCA-Report.md, npm-audit-report.json, security-pipeline.yml. | [SR-09](../../Phase1/Documentation/SecurityRequirements.md), [SCA-Report.md](SCA-Report.md), [DevSecOps-Pipeline.md](DevSecOps-Pipeline.md) |
| V14 | Data Protection | V14-REQ-01 | Define controls to prevent unauthorized data disclosure. | L1 | In Progress | Mapped to information disclosure threats. Test execution pending. | [SR-05](../../Phase1/Documentation/SecurityRequirements.md), [SR-06](../../Phase1/Documentation/SecurityRequirements.md) |
| V14 | Data Protection | V14-REQ-02 | Define data minimization and confidentiality expectations. | L1 | In Progress | Tied to GDPR context and SR-06. | [SR-06](../../Phase1/Documentation/SecurityRequirements.md) |
| V15 | Secure Coding and Architecture | V15-REQ-01 | Define threat-driven architecture and secure design practices. | L1 | Compliant | Analysis, DFDs, threats, risk, and mitigations documented in Phase 1. | [Analysis.md](../../Phase1/Documentation/Analysis.md) |
| V15 | Secure Coding and Architecture | V15-REQ-02 | Define architecture review checkpoints when trust boundaries change. | L1 | In Progress | Threat-model review planned for Sprint 2 delivery. | [SecurityTesting.md](../../Phase1/Documentation/SecurityTesting.md) |
| V16 | Security Logging and Error Handling | V16-REQ-01 | Define audit logging requirements for sensitive actions and decisions. | L1 | **Compliant** | **[Sprint 1]** CI/CD pipeline with `security-pipeline.yml` established. All SAST and SCA jobs produce auditable artifacts retained 30 days. Pipeline triggers on every PR enforcing security quality gates. Evidence: security-pipeline.yml, GitHub Actions artifact retention. | [SR-07](../../Phase1/Documentation/SecurityRequirements.md), [DevSecOps-Pipeline.md](DevSecOps-Pipeline.md) |
| V16 | Security Logging and Error Handling | V16-REQ-02 | Define secure error-handling behavior to avoid sensitive leakage. | L1 | Not Started | Error-handling hardening planned for Sprint 2. | Deferred to Sprint 2 |
| V17 | WebRTC | V17-REQ-01 | Define WebRTC-specific security controls where real-time communication exists. | L1 | Not Applicable | No WebRTC in scope. | N/A |

---

## Sprint 1 Status Changes

| Req ID | Previous Status | Sprint 1 Status | Change Reason |
|--------|----------------|-----------------|---------------|
| V13-REQ-02 | In Progress | **Compliant** | npm audit executed and integrated into CI pipeline; Dependabot configured |
| V16-REQ-01 | In Progress | **Compliant** | GitHub Actions pipeline established with artifact retention and enforced quality gates |
| V1-REQ-01 | In Progress | In Progress | SAST scan revealed `any` type issues; ongoing |
| V5-REQ-01 | In Progress | In Progress | SAST finding SF-01 (path traversal risk) opened; remediation pending |

---

## Summary

| Status | Count |
|--------|-------|
| Compliant | 4 (+2 from Phase 1) |
| In Progress | 16 |
| Not Started | 5 |
| Not Applicable | 2 |
| **Total tracked** | **27** |
