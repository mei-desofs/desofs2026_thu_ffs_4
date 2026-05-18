# Traceability Matrix - Phase 2 Sprint 1

## 1. Purpose

This matrix extends Phase 1 traceability by linking security requirements (SR-_), planned test cases (ST-_), and Sprint 1 execution evidence (SAST/SCA/pipeline artifacts).

## 2. Scope

- Carries forward the SR -> ST mapping from Phase 1.
- Adds Sprint 1 evidence from SAST/SCA scans and pipeline artifacts.
- Marks execution status for each test case in Sprint 1.

## 3. Evidence Sources (Sprint 1)

- SAST: [SAST-Report.md](SAST-Report.md)
- SCA: [SCA-Report.md](SCA-Report.md)
- Pipeline: [DevSecOps-Pipeline.md](DevSecOps-Pipeline.md)
- Raw artifacts: [CantinasApp/Backend/reports/eslint-report.json](../../../CantinasApp/Backend/reports/eslint-report.json), [CantinasApp/Backend/reports/npm-audit-report.json](../../../CantinasApp/Backend/reports/npm-audit-report.json)
- Phase 1 test plan: [SecurityTesting.md](../../Phase1/Documentation/SecurityTesting.md)
- Phase 1 traceability: [TraceabilityMatrix.md](../../Phase1/Documentation/TraceabilityMatrix.md)

## 4. Requirements -> Tests -> Evidence

| Requirement ID                                 | Test IDs (Phase 1) | Sprint 1 Evidence                                                                                                                               | Sprint 1 Test Execution Status      |
| ---------------------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| SR-01 Authentication for sensitive endpoints   | ST-01, ST-06       | SAST code-quality signal for auth risk in [SAST-Report.md](SAST-Report.md) (CQ-02 references ST-01)                                             | Executed (automated evidence)       |
| SR-02 Role-based authorization                 | ST-02              | SAST code-quality signal in [SAST-Report.md](SAST-Report.md) (CQ-02 references ST-02)                                                           | Executed (automated evidence)       |
| SR-03 Input validation/sanitization            | ST-03              | SAST findings in [SAST-Report.md](SAST-Report.md) (SF-02 maps to ST-03); pipeline checks in [DevSecOps-Pipeline.md](DevSecOps-Pipeline.md)      | Executed (automated evidence)       |
| SR-04 Upload restrictions and file handling    | ST-04              | SAST findings in [SAST-Report.md](SAST-Report.md) (SF-01 maps to ST-04); pipeline checks in [DevSecOps-Pipeline.md](DevSecOps-Pipeline.md)      | Executed (automated evidence)       |
| SR-05 Protected document access                | ST-05              | SAST findings in [SAST-Report.md](SAST-Report.md) (SF-01 also maps to ST-05)                                                                    | Executed (automated evidence)       |
| SR-06 Confidentiality and least-data exposure  | ST-06              | No Sprint 1 execution evidence; requirement tracked in Phase 1 plan                                                                             | Not executed (no Sprint 1 evidence) |
| SR-07 Audit logging and traceability           | ST-07              | Pipeline evidence retained as artifacts in [DevSecOps-Pipeline.md](DevSecOps-Pipeline.md) (supports auditability but not a functional log test) | Executed (automated evidence)       |
| SR-08 Availability controls (rate/size limits) | ST-08, ST-09       | SCA DoS-related CVEs in [SCA-Report.md](SCA-Report.md) (CVE-01/03/04); pipeline checks in [DevSecOps-Pipeline.md](DevSecOps-Pipeline.md)        | Executed (automated evidence)       |
| SR-09 Dependency vulnerability management      | ST-10              | Executed in [SCA-Report.md](SCA-Report.md) (ST-10 section); pipeline gate in [DevSecOps-Pipeline.md](DevSecOps-Pipeline.md)                     | Executed (SCA)                      |

## 5. Notes on Completeness

- Sprint 1 execution evidence covers automated SAST/SCA and pipeline artifacts.
- Evidence references align with the Sprint 1 ASVS updates in [ASVS-Sprint1.md](ASVS-Sprint1.md).
- SR-06 has no Sprint 1 evidence as it is planned for later sprints; We had issues with organization permissions for the secret scan in Sprint 1, which is why it was deferred. We will ensure it is executed in Sprint 2 to maintain traceability for SR-06.
