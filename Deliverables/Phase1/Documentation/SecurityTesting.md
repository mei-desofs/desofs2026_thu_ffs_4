# Security Testing Plan - Phase 1

## 1. Purpose

This plan defines how security testing is derived from threat modeling artifacts and security requirements for the CantinasApp project.

Phase 1 focuses on planning, traceability, and test design. Execution automation and pipeline integration are planned for Phase 2.

## 2. Objectives

- Validate that high-risk threats from threat analysis are testable.
- Define repeatable test scenarios for abuse/misuse cases.
- Establish traceability from threats and mitigations to test cases.
- Define a threat model review process before implementation hardening.
- Align planned tests with ASVS architecture-relevant controls.

## 3. Scope

In scope:

- Authentication and role-based authorization controls
- Input validation and file upload handling
- Access control and predictable resource identifiers
- Transport and data disclosure risks
- Availability threats in upload and application handling flows
- Logging and auditability for repudiation cases

Out of scope in Phase 1:

- Full automation in CI/CD
- Production penetration testing
- Large-scale performance testing in production-like environment

## 4. Test Methodology

### 4.1 Test types

- Manual abuse-case testing using API clients
- Negative testing for authorization and validation
- Security code review checklist for critical flows
- Dependency/security baseline checks definition (to execute in Phase 2)

### 4.2 Test approach

The test cases ST-01 to ST-10 are derived from the misuse and abuse cases documented in threat-analysis.md, and each scenario is mapped to threats identified through STRIDE to ensure direct traceability from threat modeling to security testing.

1. Select high-priority threats from risk assessment.
2. Map each threat to one or more test cases.
3. Define expected secure behavior and rejection criteria.
4. Record evidence and residual risk.
5. Revisit threat model after major architecture changes.

### 4.3 Entry and exit criteria

Entry criteria:

- DFDs and threat analysis approved by the team
- Risk ranking and mitigations documented

Exit criteria (Phase 1):

- Security test cases documented and reviewed
- Traceability matrix completed
- ASVS architecture checklist completed with status

## 5. Threat Model Review Process

Review cadence:

- Mandatory review at end of Phase 1
- Review after adding new major API endpoints or trust boundaries
- Review before each sprint submission

Review participants:

- One backend developer
- One reviewer not authoring the flow under review
- Team member responsible for threat model documentation

Review checklist:

- New components reflected in DFDs
- STRIDE coverage still valid
- Abuse/misuse cases updated
- New risks ranked and mitigations proposed
- Test traceability updated

## 6. Security Test Cases

| Test ID | Threat Category        | Threat Reference                        | Scenario                                                                           | Expected Result                                              | Priority |
| ------- | ---------------------- | --------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------ | -------- |
| ST-01   | Spoofing               | Supplier/Manager identity spoofing      | Attempt privileged endpoint access using forged/invalid token                      | Request is rejected with authentication/authorization error  | High     |
| ST-02   | Elevation of Privilege | URL/endpoint privilege escalation       | Authenticated low-privilege user calls manager-only actions                        | Access denied and action not executed                        | High     |
| ST-03   | Tampering              | Parameter tampering in application data | Modify protected fields in request payload (for example userId/application status) | Invalid or unauthorized changes are rejected                 | High     |
| ST-04   | Tampering              | Malicious file upload                   | Upload file with disallowed content type or suspicious payload                     | Upload rejected and event logged                             | High     |
| ST-05   | Information Disclosure | Predictable document access             | Attempt access to other supplier document by guessing identifiers/path             | Access denied; no sensitive file leakage                     | High     |
| ST-06   | Information Disclosure | Unprotected records fetch               | Intercept/inspect API response scope for non-authorized user                       | Only authorized and minimal data returned                    | High     |
| ST-07   | Repudiation            | Upload denial without evidence          | Perform upload/update actions and inspect audit evidence                           | Action is traceable by actor, timestamp, and action metadata | Medium   |
| ST-08   | Denial of Service      | Upload resource exhaustion              | Submit repeated large upload requests beyond limits                                | Rate/size controls trigger and service remains available     | Medium   |
| ST-09   | Denial of Service      | Request flooding                        | Burst requests to application handling endpoints                                   | Service degrades gracefully and monitoring triggers alerts   | Medium   |
| ST-10   | Dependency Risk        | Vulnerable dependency presence          | Run dependency vulnerability scan (planned in Sprint 1)                            | Known critical vulnerabilities are reported and triaged      | Medium   |

## 7. Security Requirements Under Test

| Requirement ID | Security Requirement                                            | Related Test IDs |
| -------------- | --------------------------------------------------------------- | ---------------- |
| SR-01          | Enforce authentication for sensitive endpoints                  | ST-01, ST-06     |
| SR-02          | Enforce role-based authorization for privileged actions         | ST-02            |
| SR-03          | Validate and sanitize all input fields                          | ST-03            |
| SR-04          | Restrict upload types and validate file handling                | ST-04            |
| SR-05          | Prevent unauthorized access to stored documents                 | ST-05            |
| SR-06          | Ensure confidentiality and least-data exposure in API responses | ST-06            |
| SR-07          | Keep auditable logs for sensitive operations                    | ST-07            |
| SR-08          | Enforce request throttling and upload limits                    | ST-08, ST-09     |
| SR-09          | Monitor and triage third-party vulnerabilities                  | ST-10            |

## 8. Traceability Matrix (Threat -> Mitigation -> Test)

| Threat (STRIDE)            | Mitigation Reference                                    | Test IDs     |
| -------------------------- | ------------------------------------------------------- | ------------ |
| Spoofing                   | RBAC, strong authentication, token validation           | ST-01        |
| Elevation of Privilege     | Authorization checks on privileged endpoints            | ST-02        |
| Tampering                  | Input validation, parameter validation, file validation | ST-03, ST-04 |
| Information Disclosure     | Access checks, secure document access, least privilege  | ST-05, ST-06 |
| Repudiation                | Logging and monitoring                                  | ST-07        |
| Denial of Service          | Size limits, throttling, availability controls          | ST-08, ST-09 |
| Dependency vulnerabilities | Dependency scanning and patching process                | ST-10        |

## 9. Evidence and Reporting Template

For each executed test, record:

- Test ID
- Date and tester
- Endpoint or component
- Input and preconditions
- Expected result
- Actual result
- Evidence link (log, screenshot, report)
- Status (Pass/Fail)
- Residual risk and follow-up action

## 10. Phase 2 Transition

The following items move to Sprint 1/Sprint 2 implementation:

- CI pipeline integration for SAST/SCA
- Automated security regression checks for critical endpoints
- Security defect tracking and re-test workflow
- Expanded DAST/IAST and operational monitoring validation
