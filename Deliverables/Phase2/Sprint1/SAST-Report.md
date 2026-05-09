# SAST Report – Sprint 1

**Tool:** ESLint 8.57.1 + eslint-plugin-security 3.0.1 + @typescript-eslint 7.18.0  
**Scan date:** 2026-05-09  
**Codebase:** `CantinasApp/Backend/src/`  
**Raw report:** [`reports/eslint-report.json`](../../../CantinasApp/Backend/reports/eslint-report.json)

---

## Summary

| Severity | Count |
|----------|-------|
| Errors (security + code quality) | 25 |
| Warnings (security + code quality) | 219 |
| **Total** | **244** |

---

## Security Findings (eslint-plugin-security)

These findings are directly relevant to the threat model from Phase 1.

### SF-01 — Non-Literal Filesystem Filename (HIGH risk)

| Attribute | Value |
|-----------|-------|
| Rule | `security/detect-non-literal-fs-filename` |
| Severity | Warning |
| Files | `src/Controller/ApplicationController.ts:161`, `src/Controller/ApplicationController.ts:193` |
| CWE | CWE-22 (Path Traversal) |

**Description:** `fs.renameSync()` is called with non-literal (dynamic) filename arguments derived from request data. If the filename is not strictly validated, an attacker could supply a path like `../../etc/passwd` to move or overwrite files outside the intended upload directory.

**Phase 1 linkage:** TH-T-02 (Malicious script upload), TH-I-01 (Predictable document URLs), SR-04 (Upload restrictions), SR-05 (Protected document access)

**Remediation:** Sanitize and normalize all filename inputs using `path.basename()` before using them in `fs` operations. Verify the resolved path is within the allowed upload directory using `path.resolve()` and prefix checks.

**Status:** Open — remediation tracked for Sprint 1 or Sprint 2.

---

### SF-02 — Generic Object Injection Sink (MEDIUM risk)

| Attribute | Value |
|-----------|-------|
| Rule | `security/detect-object-injection` |
| Severity | Warning |
| Files | `src/Service/WasteReportService.ts:366`, `src/Service/WasteReportService.ts:368`, `src/Service/WasteReportService.ts:380` |
| CWE | CWE-1321 (Prototype Pollution) |

**Description:** Dynamic property access using bracket notation (`obj[userInput]`) can allow prototype pollution if the key is user-controlled and not sanitized. An attacker could set `__proto__` or `constructor` properties to tamper with object behavior.

**Phase 1 linkage:** TH-T-01 (Parameter tampering in application data), SR-03 (Input validation/sanitization)

**Remediation:** Validate that the key cannot be `__proto__`, `constructor`, or `prototype` before using it as an object accessor. Consider using `Object.hasOwn()` or `Map` instead of plain objects for dynamic key storage.

**Status:** Open — remediation tracked for Sprint 1 or Sprint 2.

---

## Code Quality Findings (Security-Adjacent)

These findings are not direct security vulnerabilities but represent coding practices that increase security risk surface.

### CQ-01 — `require()` instead of ES6 `import` (25 instances)

| Rule | `@typescript-eslint/no-var-requires` |
|------|--------------------------------------|
| Files | `ApplicationController.ts`, `ReservationService.ts`, `WasteReportService.ts`, `MenuService.ts` |

Using `require()` inside TypeScript source bypasses module resolution type checking and can hide injection of unexpected module paths at runtime.

**Remediation:** Replace with ES6 `import` statements at the top of each file.

### CQ-02 — Widespread `any` type usage (190+ instances)

| Rule | `@typescript-eslint/no-explicit-any` |
|------|--------------------------------------|
| Scope | All Controllers, Services, Middlewares |

Pervasive `any` types disable TypeScript's type safety. In security-sensitive code (auth middleware, request handlers), this prevents the compiler from catching incorrect data shapes that could lead to injection or authorization bypasses.

**Remediation:** Gradually replace `any` with explicit types. Prioritize `authMiddleware.ts` and `authorizeRoles.ts`.

---

## True Positive Assessment

| Finding | True Positive? | Notes |
|---------|---------------|-------|
| SF-01 (fs.renameSync) | **Yes** | `renameSync` called with `req.file.originalname` — directly from HTTP request |
| SF-02 (Object injection in WasteReportService) | **Yes** | Dynamic key is derived from loop variable over report data — needs key whitelist |
| CQ-01 (no-var-requires) | Yes (code quality) | Not a direct exploit but reduces type safety |
| CQ-02 (no-explicit-any) | Yes (code quality) | Security risk in auth middleware specifically |

---

## Traceability to Phase 1 Security Test Cases

| SAST Finding | Phase 1 Test Case | Phase 1 Threat |
|--------------|------------------|----------------|
| SF-01 (path traversal risk) | ST-04 (malicious file upload) | TH-T-02 |
| SF-01 (path traversal risk) | ST-05 (predictable document access) | TH-I-01 |
| SF-02 (object injection) | ST-03 (parameter tampering) | TH-T-01 |
| CQ-02 (any in auth middleware) | ST-01 (auth bypass), ST-02 (privilege escalation) | TH-S-01, TH-E-01 |
