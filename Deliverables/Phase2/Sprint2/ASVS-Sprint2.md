# ASVS Checklist - Phase 2 Sprint 2 (ASVS 5.0)

Sprint: Phase 2 - Sprint 2
Date: 2026-06-12
Base: Carries forward from [ASVS-Sprint1.md](../Sprint1/ASVS-Sprint1.md)

Status values: Not Started | In Progress | Compliant | Not Applicable

Sprint 2 updates are marked with [Sprint 2] in the Observations column.

---

## Checklist

| Section ID | Section Name | Req ID | Description | Level | Status | Observations | Reference/Link |
|---|---|---|---|---|---|---|---|
| V1 | Encoding and Sanitization | V1-REQ-01 | Define input sanitization and normalization rules for all untrusted fields. | L1 | Compliant | [Sprint 2] any types removed from authMiddleware.ts and authorizeRoles.ts. Express Request extended with typed user property in src/types/express.d.ts. Joi schemas remain active for all key endpoints. | [authMiddleware.ts](../../../CantinasApp/Backend/src/middlewares/authMiddleware.ts), [express.d.ts](../../../CantinasApp/Backend/src/types/express.d.ts) |
| V1 | Encoding and Sanitization | V1-REQ-02 | Define output encoding requirements for data rendered or exported to clients. | L1 | Compliant | [Sprint 2] helmet.js added with Content-Security-Policy, X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security, Referrer-Policy. Global errorHandler middleware strips internal error details from all responses. | [index.ts](../../../CantinasApp/Backend/index.ts), [errorHandler.ts](../../../CantinasApp/Backend/src/middlewares/errorHandler.ts) |
| V2 | Validation and Business Logic | V2-REQ-01 | Define input validation controls before business logic and persistence. | L1 | Compliant | [Sprint 2] npm audit confirms 0 high/critical vulnerabilities after dependency resolution. Sequelize CVE-02 resolved by patched version installed via ^6.37.7 range. Joi validation active on all key endpoints. | [SCA-Report.md](SCA-Report.md), [package.json](../../../CantinasApp/Backend/package.json) |
| V2 | Validation and Business Logic | V2-REQ-02 | Define abuse-resistant constraints for high-value workflows. | L1 | Compliant | [Sprint 2] Duplicate reservation guard added in ReservationService.createReservation - returns DUPLICATE_RESERVATION error if active reservation already exists for the same user and meal. Dedicated reservationLimiter (5 req/min) applied to POST /reservations. | [ReservationService.ts](../../../CantinasApp/Backend/src/Service/ReservationService.ts), [ReservationRoutes.ts](../../../CantinasApp/Backend/src/Routes/ReservationRoutes.ts) |
| V3 | Web Frontend Security | V3-REQ-01 | Define browser/frontend security requirements for client-side attack reduction. | L1 | Compliant | [Sprint 2] helmet.js configured with full security header suite: CSP restricting script/style/connect to self, frameAncestors none (clickjacking), HSTS, X-Content-Type-Options nosniff, Referrer-Policy. CORS origin locked to env-configurable CORS_ORIGIN. | [index.ts](../../../CantinasApp/Backend/index.ts) |
| V4 | API and Web Service | V4-REQ-01 | Define API authorization and access checks for privileged operations. | L1 | Compliant | JWT auth and role middleware in place and tested. 12 middleware tests passing. | [authMiddleware.ts](../../../CantinasApp/Backend/src/middlewares/authMiddleware.ts), [authorizeRoles.ts](../../../CantinasApp/Backend/src/middlewares/authorizeRoles.ts) |
| V4 | API and Web Service | V4-REQ-02 | Define secure API response behavior to reduce unnecessary data exposure. | L1 | Compliant | errorHandler ensures no stack traces or internal details leak. UserController.register no longer returns error details from catch blocks. | [errorHandler.ts](../../../CantinasApp/Backend/src/middlewares/errorHandler.ts) |
| V5 | File Handling | V5-REQ-01 | Define file type and upload size restrictions. | L1 | Compliant | [Sprint 2] SF-01 addressed - path.resolve bounds check added to both file rename operations in ApplicationController. safeFilename already uses crypto.randomUUID(). | [ApplicationController.ts](../../../CantinasApp/Backend/src/Controller/ApplicationController.ts), [SAST-Report.md](SAST-Report.md) |
| V5 | File Handling | V5-REQ-02 | Define secure file retrieval and document access authorization rules. | L1 | In Progress | File access via /uploads static route. Authorization check on retrieval not yet implemented. | |
| V6 | Authentication | V6-REQ-01 | Define authentication requirements for sensitive endpoints. | L1 | Compliant | JWT authentication middleware implemented and tested. Login events logged with userId and role. Failed logins logged with reason. | [UserController.ts](../../../CantinasApp/Backend/src/Controller/UserController.ts) |
| V6 | Authentication | V6-REQ-02 | Define credential and identity assurance baseline for privileged users. | L1 | Compliant | bcrypt password hashing. JWT_SECRET consistency fix applied - UserController now uses JWT_SECRET env var (was using wrong SECRET_KEY). | [UserController.ts](../../../CantinasApp/Backend/src/Controller/UserController.ts) |
| V7 | Session Management | V7-REQ-01 | Define session timeout and invalidation requirements. | L1 | In Progress | JWT expires in 1 day. Token blacklist/invalidation not implemented. | |
| V8 | Authorization | V8-REQ-01 | Define role-based authorization model for all protected operations. | L1 | Compliant | authorizeRoles middleware typed and tested. Logs forbidden access attempts. | [authorizeRoles.ts](../../../CantinasApp/Backend/src/middlewares/authorizeRoles.ts) |
| V8 | Authorization | V8-REQ-02 | Define least-privilege rules and privileged action constraints. | L1 | Compliant | 10 roles defined. Routes enforce role requirements via authorizeRoles. | |
| V9 | Self-contained Tokens | V9-REQ-01 | Define token claim validation and token misuse protections. | L1 | Compliant | [Sprint 2] any type removed from authMiddleware.ts. Token claims now typed and validated. JWT_SECRET is the same key used for both sign (UserController) and verify (authMiddleware). | [authMiddleware.ts](../../../CantinasApp/Backend/src/middlewares/authMiddleware.ts) |
| V10 | OAuth and OIDC | V10-REQ-01 | Define OAuth/OIDC controls when delegated identity is used. | L1 | Not Applicable | No OAuth/OIDC in scope. | N/A |
| V11 | Cryptography | V11-REQ-01 | Define data-at-rest protection requirements for sensitive data. | L1 | In Progress | Passwords hashed with bcrypt. Full at-rest encryption not implemented. | |
| V12 | Secure Communication | V12-REQ-01 | Define data-in-transit protection requirements. | L1 | In Progress | HSTS header set via helmet. TLS enforcement depends on deployment configuration. | |
| V13 | Configuration | V13-REQ-01 | Define secure configuration baseline and validation process. | L1 | Compliant | helmet.js enforces secure defaults. CORS origin is env-configurable. JWT_SECRET checked at startup. | [index.ts](../../../CantinasApp/Backend/index.ts) |
| V13 | Configuration | V13-REQ-02 | Define dependency and configuration hygiene controls for third-party components. | L1 | Compliant | npm audit: 3 moderate, 0 high, 0 critical. SCA pipeline gate enforced. Dependabot active. | [SCA-Report.md](SCA-Report.md) |
| V14 | Data Protection | V14-REQ-01 | Define controls to prevent unauthorized data disclosure. | L1 | Compliant | errorHandler prevents sensitive data leakage. UserService.findById excludes password from results. Login response excludes password. | |
| V14 | Data Protection | V14-REQ-02 | Define data minimization and confidentiality expectations. | L1 | In Progress | Response DTOs reviewed for minimal exposure. Full audit not complete. | |
| V15 | Secure Coding and Architecture | V15-REQ-01 | Define threat-driven architecture and secure design practices. | L1 | Compliant | Phase 1 documentation complete. | |
| V15 | Secure Coding and Architecture | V15-REQ-02 | Define architecture review checkpoints when trust boundaries change. | L1 | Compliant | Threat model reviewed and security controls traced to Sprint 2 implementation. | [TraceabilityMatrix.md](TraceabilityMatrix.md) |
| V16 | Security Logging and Error Handling | V16-REQ-01 | Define audit logging requirements for sensitive actions and decisions. | L1 | Compliant | [Sprint 2] Application-level structured logging added with winston. Logs: login success/failure, auth token rejection, authorization failures, quarantine events, server startup/errors. Log files at logs/app.log and logs/error.log. | [logger.ts](../../../CantinasApp/Backend/src/utils/logger.ts) |
| V16 | Security Logging and Error Handling | V16-REQ-02 | Define secure error-handling behavior to avoid sensitive leakage. | L1 | Compliant | [Sprint 2] Global errorHandler middleware returns { message: "Internal server error" } for all unhandled errors. No stack traces, no internal error messages exposed. Tested in security.unit.test.ts. | [errorHandler.ts](../../../CantinasApp/Backend/src/middlewares/errorHandler.ts), [security.unit.test.ts](../../../CantinasApp/Backend/src/tests/security.unit.test.ts) |
| V17 | WebRTC | V17-REQ-01 | Define WebRTC-specific security controls where real-time communication exists. | L1 | Not Applicable | No WebRTC in scope. | N/A |

---

## Sprint 2 Status Changes

| Req ID | Sprint 1 Status | Sprint 2 Status | Change Reason |
|---|---|---|---|
| V1-REQ-01 | In Progress | Compliant | any types removed in authMiddleware and authorizeRoles, Express Request typed |
| V1-REQ-02 | Not Started | Compliant | helmet.js and global errorHandler implemented |
| V2-REQ-01 | In Progress | Compliant | Sequelize CVE resolved via patched version, confirmed by npm audit |
| V2-REQ-02 | In Progress | Compliant | Duplicate reservation guard and dedicated rate limiter implemented |
| V3-REQ-01 | Not Started | Compliant | helmet.js with full header suite, CORS hardened |
| V4-REQ-02 | In Progress | Compliant | errorHandler and cleaned controller error responses |
| V5-REQ-01 | In Progress | Compliant | path.resolve bounds check added to ApplicationController |
| V6-REQ-01 | In Progress | Compliant | Login events logged, auth middleware tested |
| V6-REQ-02 | In Progress | Compliant | JWT_SECRET consistency fix applied |
| V9-REQ-01 | In Progress | Compliant | any type removed, token claims properly typed |
| V13-REQ-01 | Not Started | Compliant | helmet defaults, env-configurable CORS, startup key check |
| V15-REQ-02 | In Progress | Compliant | Traceability matrix complete |
| V16-REQ-02 | Not Started | Compliant | Global errorHandler strips sensitive data from responses |
| V16-REQ-01 | Compliant | Compliant | Extended with application-level winston logging |

---

## Summary

| Status | Count |
|---|---|
| Compliant | 18 |
| In Progress | 5 |
| Not Applicable | 2 |
| Not Started | 0 |
| Total tracked | 25 |
