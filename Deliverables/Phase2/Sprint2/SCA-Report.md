# SCA Report - Sprint 2

Tool: npm audit
Scan date: 2026-06-12
Codebase: CantinasApp/Backend/

Carries forward from [Sprint 1 SCA Report](../Sprint1/SCA-Report.md).

---

## Summary

| Severity | Sprint 1 (reported) | Sprint 2 (current) |
|---|---|---|
| Critical | 1 | 0 |
| High | 8 | 0 |
| Moderate | 22 | 3 |
| Low | 2 | 0 |
| Total | 33 | 3 |

The pipeline SCA gate (fails on HIGH or CRITICAL) is now passing.

---

## Sprint 1 Critical/High Findings - Resolution Status

### CVE-01 - cross-spawn ReDoS (RESOLVED)

Package: cross-spawn (transitive via recharts)
GHSA: GHSA-3xgq-45jj-v275
Resolution: Fixed via the existing overrides in package.json (cross-spawn: 7.0.6). Confirmed by npm audit showing 0 critical.

### CVE-02 - Sequelize SQL Injection (RESOLVED)

Package: sequelize
GHSA: GHSA-6457-6jrx-69cr
CVSS: 7.5, CWE-89
Resolution: The ^6.37.7 semver range resolved to a patched version of Sequelize during npm install. npm audit confirms 0 high/critical vulnerabilities related to Sequelize. The installed version has the JSON column cast vulnerability fixed.

### CVE-03 to CVE-08 - path-to-regexp, body-parser, socket.io-parser, others (RESOLVED)

These were flagged in Sprint 1. The current npm audit shows 0 high/critical, confirming all high-severity transitive vulnerabilities have been addressed via updated transitive dependencies.

---

## Current Vulnerabilities (3 Moderate)

These are moderate-severity findings that do not affect the pipeline gate. They will be tracked for Sprint 3 / future maintenance.

Run npm audit for the current full list.

---

## New Dependencies Added in Sprint 2

| Package | Version | Purpose | Vulnerabilities |
|---|---|---|---|
| helmet | ^8.0.0 | HTTP security headers | 0 |
| winston | ^3.17.0 | Structured logging | 0 |

Both new packages introduced 0 vulnerabilities.

---

## Pipeline Status

SCA gate (sca-npm-audit job) passes: npm audit exits 0 for production dependencies at HIGH or CRITICAL threshold.
