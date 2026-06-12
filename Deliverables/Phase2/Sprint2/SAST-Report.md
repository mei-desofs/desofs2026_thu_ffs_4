# SAST Report - Sprint 2

Tool: ESLint 8.57.1 + eslint-plugin-security 3.0.1 + @typescript-eslint 7.18.0
Scan date: 2026-06-12
Codebase: CantinasApp/Backend/src/

Carries forward from [Sprint 1 SAST Report](../Sprint1/SAST-Report.md).

---

## Sprint 2 Changes

Sprint 2 addressed the two security findings from Sprint 1. SF-01 (path traversal) was fixed. SF-02 (object injection in WasteReportService) was reviewed and documented as an accepted false positive.

---

## SF-01 - Path Traversal in ApplicationController (RESOLVED)

| Attribute | Value |
|---|---|
| Rule | security/detect-non-literal-fs-filename |
| Files | src/Controller/ApplicationController.ts |
| CWE | CWE-22 |
| Sprint 2 Status | Resolved |

Resolution: path.resolve() bounds check added to both file rename operations. The resolved path is verified to start with the uploads directory before calling fs.renameSync(). safeFilename() was already in use (crypto.randomUUID() + extension), so the original filename is discarded before path construction. The combination of UUID filename generation and bounds checking eliminates the path traversal risk.

Evidence: [ApplicationController.ts](../../../CantinasApp/Backend/src/Controller/ApplicationController.ts), [security.unit.test.ts - path traversal protection](../../../CantinasApp/Backend/src/tests/security.unit.test.ts)

---

## SF-02 - Object Injection in WasteReportService (ACCEPTED FALSE POSITIVE)

| Attribute | Value |
|---|---|
| Rule | security/detect-object-injection |
| Files | src/Service/WasteReportService.ts |
| CWE | CWE-1321 |
| Sprint 2 Status | Accepted false positive |

Analysis: The ESLint rule fires on bracket notation access with Sequelize operator symbols (Op.gte, Op.lte). These keys are Sequelize library constants defined as JavaScript Symbols, not user-controlled strings. Prototype pollution requires an attacker-controlled string key such as __proto__ or constructor. Symbol keys cannot be the result of JSON.parse or any standard user input vector, and cannot prototype-pollute plain objects. The finding is a known limitation of static analysis tools when Sequelize operator syntax is used. The risk is accepted.

---

## CQ-02 - any Type Usage (PARTIALLY RESOLVED)

Sprint 1 identified 190+ instances. Sprint 2 resolved the highest-risk instances:

- authMiddleware.ts: (req as any).user replaced with typed req.user via express.d.ts declaration
- authorizeRoles.ts: (req as any).user replaced with typed req.user
- UserController.ts: err: any replaced with err: unknown, proper instanceof Error checks

Remaining any instances in controller and service files are lower priority (non-security-sensitive paths) and tracked for future cleanup.

---

## CQ-01 - require() instead of ES6 import (DEFERRED)

Still present in ApplicationController.ts and other files due to dynamic import patterns. Not a security risk in this context. Deferred.

---

## New Security Controls (Sprint 2)

These controls were added and verified:

| Control | File | Verification |
|---|---|---|
| helmet.js security headers | index.ts | Manually verified on local server run |
| Global error handler | src/middlewares/errorHandler.ts | 2 unit tests in security.unit.test.ts |
| Typed Request.user | src/types/express.d.ts | TypeScript build passes (npx tsc --noEmit) |
| Winston structured logging | src/utils/logger.ts | Logs visible in test output and logs/ directory |
| Duplicate reservation guard | src/Service/ReservationService.ts | 2 unit tests in security.unit.test.ts |
| safeFilename path safety | src/utils/fileUtils.ts | 3 unit tests in security.unit.test.ts |
