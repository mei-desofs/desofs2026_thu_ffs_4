# Traceability Matrix - Phase 2 Sprint 2

This document traces each ASVS requirement (V1, V2, V3, V17 - assigned sections) to the implementation and test evidence.

---

## V1 - Encoding and Sanitization

### V1-REQ-01 - Input sanitization for untrusted fields

Phase 1 requirement: SR-03

Implementation:
- Joi validation schemas in src/Schemas/ applied at controller entry points
- Express Request.user typed via src/types/express.d.ts - eliminates any cast that bypassed type checking on token claims
- authMiddleware.ts validates id and role presence before attaching to request

Code: [src/types/express.d.ts](../../../CantinasApp/Backend/src/types/express.d.ts), [src/middlewares/authMiddleware.ts](../../../CantinasApp/Backend/src/middlewares/authMiddleware.ts)

Tests: middlewares.unit.test.ts - authMiddleware describe block (6 tests covering missing token, invalid format, invalid/missing claims, valid token)

### V1-REQ-02 - Output encoding / no sensitive data in responses

Phase 1 requirement: SR-06

Implementation:
- helmet.js in index.ts sets Content-Security-Policy, X-Content-Type-Options, X-Frame-Options (frameAncestors: none), HSTS, Referrer-Policy
- errorHandler.ts middleware returns { message: "Internal server error" } for all unhandled exceptions - no stack traces, no internal messages
- UserController.login error response uses err instanceof Error ? err.message - never exposes DB or crypto internals
- UserService.findById excludes password from query results

Code: [index.ts](../../../CantinasApp/Backend/index.ts), [src/middlewares/errorHandler.ts](../../../CantinasApp/Backend/src/middlewares/errorHandler.ts)

Tests: security.unit.test.ts - errorHandler middleware describe block (2 tests: generic message, no stack trace in response)

---

## V2 - Validation and Business Logic

### V2-REQ-01 - Input validation before business logic and persistence

Phase 1 requirement: SR-03, SR-09

Implementation:
- Joi schemas validate request body at controller entry before service calls
- Sequelize ORM provides parameterized queries for all DB operations
- Sequelize CVE-02 (GHSA-6457-6jrx-69cr) resolved - confirmed by npm audit showing 0 high/critical

Code: [src/Schemas/](../../../CantinasApp/Backend/src/Schemas/), [package.json](../../../CantinasApp/Backend/package.json)

Evidence: [SCA-Report.md](SCA-Report.md)

### V2-REQ-02 - Abuse-resistant constraints for high-value workflows

Phase 1 requirement: SR-03, [AbuseCases.md](../../Phase1/Documentation/AbuseCases.md)

Implementation:
- ReservationService.createReservation checks for existing active/pendent reservation for the same userId + mealId before creating - throws DUPLICATE_RESERVATION (409)
- ReservationRoutes.ts applies reservationLimiter (5 req/60s) on POST /reservations
- authLimiter (10 req/15min) on login and lift-tickets endpoints
- apiLimiter (200 req/15min) on general API

Code: [src/Service/ReservationService.ts](../../../CantinasApp/Backend/src/Service/ReservationService.ts), [src/middlewares/rateLimit.ts](../../../CantinasApp/Backend/src/middlewares/rateLimit.ts), [src/Routes/ReservationRoutes.ts](../../../CantinasApp/Backend/src/Routes/ReservationRoutes.ts)

Tests: security.unit.test.ts - ReservationService duplicate prevention describe block (2 tests: throws on duplicate, allows when no duplicate)

---

## V3 - Web Frontend Security

### V3-REQ-01 - Browser/frontend security requirements

Phase 1 requirement: SR-06

Implementation:
- helmet.js configured in index.ts with:
  - contentSecurityPolicy: defaultSrc self, scriptSrc self, styleSrc self, imgSrc self+data, connectSrc self, fontSrc self, objectSrc none, frameAncestors none
  - X-Frame-Options: DENY (via frameAncestors none in CSP)
  - X-Content-Type-Options: nosniff
  - Strict-Transport-Security (HSTS)
  - Referrer-Policy
- CORS hardened: allowedHeaders explicitly set to Content-Type and Authorization, origin configurable via CORS_ORIGIN env var

Code: [index.ts](../../../CantinasApp/Backend/index.ts)

Manual verification: curl -I http://localhost:3000 shows security headers in response

---

## V17 - WebRTC

### V17-REQ-01 - WebRTC controls

Not Applicable. No WebRTC functionality exists in the CantinasApp backend.

---

## Additional Security Work (Supporting Other Sections)

| Work Item | Supports | Code | Tests |
|---|---|---|---|
| Application-level winston logging | V16-REQ-01 | src/utils/logger.ts | Visible in test run output |
| Global errorHandler | V16-REQ-02 | src/middlewares/errorHandler.ts | security.unit.test.ts |
| Path traversal fix in ApplicationController | V5-REQ-01 | src/Controller/ApplicationController.ts | security.unit.test.ts - path traversal protection |
| JWT_SECRET consistency fix | V6-REQ-02, V9-REQ-01 | src/Controller/UserController.ts | middlewares.unit.test.ts |
