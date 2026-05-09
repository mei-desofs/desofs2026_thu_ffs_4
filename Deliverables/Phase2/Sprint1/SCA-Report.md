# SCA Report – Sprint 1

**Tool:** npm audit (Node.js built-in)  
**Scan date:** 2026-05-09  
**Packages scanned:** 505 (234 production, 266 dev, 1 optional)  
**Raw report:** [`reports/npm-audit-report.json`](../../../CantinasApp/Backend/reports/npm-audit-report.json)

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 1 |
| High | 8 |
| Moderate | 22 |
| Low | 2 |
| **Total** | **33** |

> The pipeline (`sca-npm-audit` job) is configured to **fail on HIGH and CRITICAL** production vulnerabilities (`--audit-level=high --production`).

---

## Critical Vulnerabilities

### CVE-01 — cross-spawn Prototype Pollution / ReDoS

| Attribute | Value |
|-----------|-------|
| Package | `cross-spawn` |
| Severity | Critical |
| Advisory | GHSA-3xgq-45jj-v275 |
| Affected range | < 7.0.5 |
| Introduced via | `recharts` (indirect) |
| Direct fix available | Yes |

**Description:** `cross-spawn` versions before 7.0.5 are vulnerable to Regular Expression Denial of Service (ReDoS) via crafted shell argument strings.

**Remediation:** `npm audit fix` can update the transitive dependency. If `recharts` is unused in the backend (it is a frontend charting library — its presence in the backend `package.json` is suspicious), remove it entirely.

**Phase 1 linkage:** TH-D-01/TH-D-02 (Denial of Service), SR-08 (Service resilience), SR-09 (Dependency vulnerability management)

---

## High Vulnerabilities

### CVE-02 — Sequelize SQL Injection via JSON Column Cast Type ⚠️ DIRECT DEPENDENCY

| Attribute | Value |
|-----------|-------|
| Package | `sequelize` |
| Severity | High |
| Advisory | [GHSA-6457-6jrx-69cr](https://github.com/advisories/GHSA-6457-6jrx-69cr) |
| CVE | CWE-89 (SQL Injection) |
| CVSS | 7.5 (AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N) |
| Affected range | 6.0.0-beta.1 – 6.37.7 |
| Installed version | 6.37.7 |
| Direct fix available | Upgrade to sequelize v7+ |

**Description:** Sequelize v6 is vulnerable to SQL injection when using JSON column type with cast operations. An attacker who can control input processed through these operations can read arbitrary data from the database.

**This is a direct dependency used extensively throughout the project (all 23 Services use Sequelize).**

**Remediation:** Upgrade to `sequelize@7.x`. This is a major version upgrade — review breaking changes before upgrading. As an interim measure, avoid using JSON column types with cast operations and ensure all inputs are validated with Joi schemas (already in place via SR-03).

**Phase 1 linkage:** TH-T-01 (Parameter tampering), SR-03 (Input validation), ST-03

---

### CVE-03 — path-to-regexp ReDoS

| Attribute | Value |
|-----------|-------|
| Package | `path-to-regexp` |
| Severity | High |
| Advisory | GHSA-rhx6-c78j-4q9w |
| Affected range | 8.0.0 – 8.3.0 |
| Introduced via | `express@5.1.0` (indirect) |
| Direct fix available | Yes (express update) |

**Description:** `path-to-regexp` versions 8.0.0–8.3.0 are vulnerable to ReDoS via crafted route patterns. This is the routing library used internally by Express 5.

**Remediation:** Update Express when a patched version is available. Monitor the Express 5 release for a fix.

**Phase 1 linkage:** TH-D-01/TH-D-02 (Denial of Service), SR-08

---

### CVE-04 — socket.io-parser Unbounded Binary Attachments DoS

| Attribute | Value |
|-----------|-------|
| Package | `socket.io-parser` |
| Severity | High |
| Advisory | GHSA-677m-j7p3-52f9 |
| Affected range | 4.0.0 – 4.2.5 |
| Introduced via | `socket.io@4.8.1` (indirect) |
| Direct fix available | Yes |

**Description:** `socket.io-parser` allows an unbounded number of binary attachments per message, enabling a resource exhaustion DoS attack.

**Remediation:** Update `socket.io` to the latest version which includes a patched parser.

**Phase 1 linkage:** TH-D-01/TH-D-02 (DoS), SR-08

---

### CVE-05 — picomatch ReDoS

| Attribute | Value |
|-----------|-------|
| Package | `picomatch` |
| Severity | High |
| Advisory | GHSA-c2c7-rcm5-vvqj |
| Affected range | <= 2.3.1 |
| Introduced via | `nodemon` (dev only) |
| Direct fix available | Yes |

**Impact:** Development tool only — does not affect production runtime.

---

### Other High Vulnerabilities (dev/indirect)

| Package | Advisory | Introduced via | Prod? |
|---------|----------|----------------|-------|
| `brace-expansion` | GHSA-wh3p-fphp-9h2m (ReDoS) | `nodemon` | No (dev) |
| `minimatch` | GHSA-f8q6-p94x-37v3 (ReDoS) | `nodemon` | No (dev) |
| `nanoid` | GHSA-qrpm-p2h7-hrv2 (entropy) | `recharts` | Indirect |

---

## Notable Moderate Vulnerabilities

| Package | Advisory | Severity | Introduced via |
|---------|----------|----------|----------------|
| `uuid@13.0.0` | GHSA-w5hq-g745-h8pq (buffer bounds) | Moderate | **Direct** |
| `qs@6.x` | GHSA-w7fw-mjwx-w883 (DoS) | Low | `express` |
| Multiple `@aws-sdk/*` | XML builder issue | Moderate | `expo-server-sdk` |

---

## Remediation Plan

| Priority | Action | Risk Reduction |
|----------|--------|---------------|
| 1 (Immediate) | Assess if `recharts` is needed in backend; remove if not | Eliminates critical + several high/moderate |
| 2 (Sprint 1/2) | Upgrade `sequelize` to v7 | Removes the only critical **direct** security vulnerability |
| 3 (Sprint 2) | Update `socket.io` to latest | Removes socket.io-parser DoS |
| 4 (Sprint 2) | Update `uuid` to >= 13.0.1 | Removes direct moderate vulnerability |
| 5 (Ongoing) | Run `npm audit fix` | Resolves all auto-fixable transitive issues |

---

## Execution of ST-10 (Security Test Case)

This report constitutes the execution of **ST-10** (Dependency vulnerability scan) as defined in Phase 1's `SecurityTesting.md`.

| ST-10 attribute | Result |
|-----------------|--------|
| Status | **Executed** |
| Tool used | npm audit 10.x |
| Findings | 33 vulnerabilities (1 critical, 8 high) |
| Direct critical deps | `sequelize@6.37.7` (SQL Injection — GHSA-6457-6jrx-69cr) |
| CI integration | `sca-npm-audit` job in security-pipeline.yml |
| Evidence | `reports/npm-audit-report.json` (artifact in GitHub Actions) |

---

## Traceability to Phase 1

| SCA Finding | Phase 1 Threat | Phase 1 Requirement | Phase 1 Test Case |
|-------------|---------------|---------------------|------------------|
| CVE-02 Sequelize SQL Injection | TH-T-03 (Vulnerable dependency) | SR-09 | ST-10 |
| CVE-03 path-to-regexp ReDoS | TH-D-01, TH-D-02 | SR-08, SR-09 | ST-09, ST-10 |
| CVE-04 socket.io DoS | TH-D-01, TH-D-02 | SR-08, SR-09 | ST-09, ST-10 |
| CVE-01 cross-spawn | TH-D-01, TH-D-02 | SR-08, SR-09 | ST-09, ST-10 |
