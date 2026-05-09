# Phase 2 – Sprint 1 Deliverable

**Sprint period:** 20/04/2026 – 18/05/2026  
**Submission deadline:** 18/05/2026  
**Team:** desofs2026_thu_ffs_4

---

## Overview

Sprint 1 focuses on the SSDLC Implementation and Testing steps. This deliverable covers the initial establishment of the DevSecOps pipeline (CI/CD automation) and the first execution of SAST and SCA security analysis tools on the existing backend codebase.

---

## Artifacts

| Artifact | Location | Description |
|----------|----------|-------------|
| GitHub Actions Pipeline | [.github/workflows/security-pipeline.yml](../../../.github/workflows/security-pipeline.yml) | CI/CD pipeline with SAST (ESLint, Semgrep) and SCA (npm audit) jobs |
| Dependabot Configuration | [.github/dependabot.yml](../../../.github/dependabot.yml) | Automated weekly dependency update PRs |
| ESLint Configuration | [CantinasApp/Backend/.eslintrc.json](../../../CantinasApp/Backend/.eslintrc.json) | ESLint rules including `eslint-plugin-security` |
| ESLint Raw Report | [CantinasApp/Backend/reports/eslint-report.json](../../../CantinasApp/Backend/reports/eslint-report.json) | Machine-readable ESLint output |
| npm audit Raw Report | [CantinasApp/Backend/reports/npm-audit-report.json](../../../CantinasApp/Backend/reports/npm-audit-report.json) | Machine-readable npm audit output |
| DevSecOps Pipeline Doc | [DevSecOps-Pipeline.md](DevSecOps-Pipeline.md) | Pipeline design, tool rationale, and traceability |
| SAST Report | [SAST-Report.md](SAST-Report.md) | ESLint security scan findings and analysis |
| SCA Report | [SCA-Report.md](SCA-Report.md) | npm audit vulnerability findings and remediation |
| ASVS Sprint 1 | [ASVS-Sprint1.md](ASVS-Sprint1.md) | Updated ASVS 5.0 checklist with Sprint 1 evidence |

---

## Sprint 1 Checklist

| Item | Status |
|------|--------|
| DevSecOps pipeline (GitHub Actions) | Done |
| SAST – ESLint with `eslint-plugin-security` | Done |
| SAST – Semgrep (automated via pipeline) | Done |
| SCA – npm audit (local + pipeline) | Done |
| SCA – Dependabot (automated PRs) | Done |
| ASVS checklist updated | Done |

---

## Traceability to Phase 1

| Sprint 1 Activity | Phase 1 Reference |
|-------------------|-------------------|
| npm audit (SCA) | ST-10, TH-T-03, SR-09, SDR-05 |
| ESLint security (SAST) | ST-03, TH-T-01, SR-03, SDR-04 |
| Semgrep (SAST) | ST-03, ST-04, TH-T-02, SR-03, SR-04 |
| Pipeline automation | SDR-10 (quality gates), SDR-02 (code review enforcement) |
| Dependabot | SDR-05 (dependency hygiene), SR-09 |
| ASVS update | V13-REQ-02, V16-REQ-01 |
