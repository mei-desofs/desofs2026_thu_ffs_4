# Phase 2 - Sprint 2 Deliverable

Sprint period: 19/05/2026 - 16/06/2026
Submission deadline: 16/06/2026
Student (sections V1, V2, V3, V17): Miguel (1190902)

## Overview

Sprint 2 focuses on completing implementation of the security controls that were deferred or left in progress in Sprint 1. The main work was implementing output encoding via security response headers (helmet.js), application-level structured logging, fixing the path traversal vulnerability in file uploads, adding duplicate reservation prevention, fixing the JWT secret key mismatch in UserController, and typing the Express Request user property to eliminate the any casts in auth middleware.

## Artifacts

| Artifact | Location | Description |
|---|---|---|
| Security headers (helmet) | CantinasApp/Backend/index.ts | Helmet middleware with CSP, HSTS, X-Frame-Options, X-Content-Type-Options |
| Structured logging | CantinasApp/Backend/src/utils/logger.ts | Winston logger for auth events, errors, and server lifecycle |
| Error handler middleware | CantinasApp/Backend/src/middlewares/errorHandler.ts | Global handler that strips internal error details from responses |
| Express type extension | CantinasApp/Backend/src/types/express.d.ts | Typed user property on Request, removes any cast in auth/authz middleware |
| Auth middleware (updated) | CantinasApp/Backend/src/middlewares/authMiddleware.ts | Typed, logs auth failures |
| AuthZ middleware (updated) | CantinasApp/Backend/src/middlewares/authorizeRoles.ts | Typed, logs authorization failures |
| Rate limiter (updated) | CantinasApp/Backend/src/middlewares/rateLimit.ts | New reservationLimiter for reservation creation endpoint |
| Reservation duplicate guard | CantinasApp/Backend/src/Service/ReservationService.ts | Checks for existing active reservation before creating |
| Path traversal fix | CantinasApp/Backend/src/Controller/ApplicationController.ts | path.resolve bounds check on both file rename operations |
| UserController fix | CantinasApp/Backend/src/Controller/UserController.ts | Consistent JWT_SECRET usage (was using wrong env var SECRET_KEY) |
| Security tests | CantinasApp/Backend/src/tests/security.unit.test.ts | 9 tests: errorHandler, safeFilename, path traversal, duplicate reservation |
| ASVS Sprint 2 | Deliverables/Phase2/Sprint2/ASVS-Sprint2.md | Updated checklist with Sprint 2 evidence |
| SAST Report Sprint 2 | Deliverables/Phase2/Sprint2/SAST-Report.md | ESLint findings and resolution status |
| SCA Report Sprint 2 | Deliverables/Phase2/Sprint2/SCA-Report.md | npm audit results after Sprint 2 |
| Traceability Matrix | Deliverables/Phase2/Sprint2/TraceabilityMatrix.md | ASVS requirements traced to code and tests |

## Test Results

| Source | Result |
|---|---|
| All test suites | 9 suites, 91 tests, 0 failures |
| New security tests | 9 tests: errorHandler (2), safeFilename (3), path traversal (2), duplicate reservation (2) |
| TypeScript build | 0 errors |
| npm audit | 3 moderate, 0 high, 0 critical |

## Sprint 2 Checklist

| Item | Status |
|---|---|
| V3-REQ-01: Security headers via helmet | Done |
| V1-REQ-02: Output encoding / error sanitization | Done |
| V1-REQ-01: Remove any types in auth middleware | Done |
| V2-REQ-01: Sequelize CVE verified resolved | Done |
| V2-REQ-02: Duplicate reservation guard + reservation rate limiter | Done |
| Application-level structured logging (winston) | Done |
| SF-01 path traversal fix in ApplicationController | Done |
| JWT secret key consistency fix in UserController | Done |
| Security unit tests | Done |
| ASVS checklist updated | Done |

## Traceability to Phase 1

| Sprint 2 Activity | Phase 1 Reference |
|---|---|
| Helmet security headers | SR-06, TH-S-02 |
| Error handler output sanitization | SR-06, SR-07 |
| Structured logging | SR-07, SDR-04 |
| Path traversal fix (SF-01) | ST-04, ST-05, TH-T-02, SR-04 |
| Duplicate reservation guard | SR-03, AbuseCases.md |
| Auth/authZ type safety | ST-01, ST-02, SR-01, SR-02 |
