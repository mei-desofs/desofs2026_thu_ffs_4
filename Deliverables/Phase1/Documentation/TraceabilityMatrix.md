# Traceability Matrix - Phase 1

## 1. Purpose

This matrix provides end-to-end traceability across Phase 1 artifacts, linking threats to risks, mitigations, requirements, tests, and ASVS chapters.

## 2. Identifier Conventions

- Threat IDs: TH-<Category>-<n>
- Risk IDs: R-<n>
- Mitigation IDs: M-<n>
- Requirement IDs: SR-<n>
- Test IDs: ST-<n>

## 3. End-to-End Matrix

| Threat ID | Threat Summary                                          | Risk ID                                             | Mitigation ID                                      | Requirement IDs | Test IDs     | ASVS Chapters |
| --------- | ------------------------------------------------------- | --------------------------------------------------- | -------------------------------------------------- | --------------- | ------------ | ------------- |
| TH-S-01   | Supplier identity spoofing in application submission    | R-01 Data Breach                                    | M-01 RBAC and strong authentication                | SR-01, SR-02    | ST-01        | V6, V8, V4    |
| TH-S-02   | Network manager spoofing to approve applications        | R-01 Data Breach                                    | M-01 RBAC and strong authentication                | SR-01, SR-02    | ST-01, ST-02 | V6, V8, V4    |
| TH-T-01   | Parameter tampering in submitted application data       | R-01 Data Breach, R-04 Software Bugs                | M-02 Input validation and integrity checks         | SR-03           | ST-03        | V1, V2        |
| TH-T-02   | Malicious file/script upload through application flow   | R-01 Data Breach, R-02 System Downtime              | M-03 Upload validation and file handling controls  | SR-04           | ST-04        | V5, V2        |
| TH-R-01   | Supplier repudiates upload or update actions            | R-01 Data Breach                                    | M-04 Logging and monitoring controls               | SR-07           | ST-07        | V16           |
| TH-I-01   | Predictable document URL reveals private supplier files | R-01 Data Breach                                    | M-05 Access checks and protected file references   | SR-05, SR-06    | ST-05        | V14, V5, V8   |
| TH-I-02   | Unprotected record fetch exposes applicant data         | R-01 Data Breach                                    | M-06 Data confidentiality and secure communication | SR-05, SR-06    | ST-06        | V12, V14, V4  |
| TH-D-01   | Large upload resource exhaustion on file storage        | R-02 System Downtime                                | M-07 Rate/size limits and resilience controls      | SR-04, SR-08    | ST-08        | V5, V13       |
| TH-D-02   | Request flooding causes application handling overload   | R-02 System Downtime                                | M-07 Rate/size limits and resilience controls      | SR-08           | ST-09        | V13, V15      |
| TH-E-01   | Privilege escalation through direct URL/endpoint access | R-01 Data Breach                                    | M-08 Authorization enforcement and least privilege | SR-02, SR-10    | ST-02        | V8, V4, V15   |
| TH-T-03   | Known vulnerable third-party dependency exploited       | R-05 Known Security Vulnerabilities in Dependencies | M-09 Dependency scanning and patching process      | SR-09           | ST-10        | V13, V15      |

## 4. Mitigation Reference Legend

| Mitigation ID | Mitigation Summary                                                  |
| ------------- | ------------------------------------------------------------------- |
| M-01          | RBAC, strong authentication, and identity verification controls     |
| M-02          | Input validation, sanitization, and parameter integrity checks      |
| M-03          | File upload restrictions, type/size checks, and content validation  |
| M-04          | Security logging, monitoring, and audit traceability                |
| M-05          | Authorization controls for file/document access                     |
| M-06          | Data confidentiality controls and secure communication              |
| M-07          | Availability controls: throttling, limits, and graceful degradation |
| M-08          | Authorization checks for privileged actions and least privilege     |
| M-09          | Dependency vulnerability management lifecycle                       |

## 5. Artifact Links

- Threat analysis: threat-analysis.md
- Risk assessment: RiskAssessment.md
- Mitigations: Mitigations.md
- Security requirements: SecurityRequirements.md
- Security testing: SecurityTesting.md
- ASVS checklist: ../ASVS-Phase1.md
