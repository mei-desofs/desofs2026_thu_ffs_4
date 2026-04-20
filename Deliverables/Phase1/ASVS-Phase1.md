# ASVS Checklist - Phase 1 (ASVS 5.0)

## 1. Small ASVS Explanation (from T4)

In T4, ASVS is presented as a verifiable security requirements baseline for application design, development, and testing. The lecture also states that ASVS 5.0 is organized into 17 chapters and that checklist tracking should use explicit statuses.

This Phase 1 checklist focuses on architecture and design evidence, using the lecture-aligned status values:

- Not Started
- In Progress
- Compliant
- Not Applicable

## 2. Checklist

| Section ID | Section Name                        | Requirement ID | Description                                                                      | Level | Status         | Observations                                                       | Reference/Link                                                                                                                                                                                                                       |
| ---------- | ----------------------------------- | -------------- | -------------------------------------------------------------------------------- | ----- | -------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| V1         | Encoding and Sanitization           | V1-REQ-01      | Define input sanitization and normalization rules for all untrusted fields.      | L1    | In Progress    | Validation requirement documented and mapped to tampering threats. | |
| V1         | Encoding and Sanitization           | V1-REQ-02      | Define output encoding requirements for data rendered or exported to clients.    | L1    | Not Started    | Planned for implementation hardening in next sprint.               | |
| V2         | Validation and Business Logic       | V2-REQ-01      | Define input validation controls before business logic and persistence.          | L1    | In Progress    | Covered by SR-03 and mapped to ST-03.                              | |
| V2         | Validation and Business Logic       | V2-REQ-02      | Define abuse-resistant constraints for high-value workflows.                     | L1    | In Progress    | Abuse/misuse cases documented in threat analysis.                  | |
| V3         | Web Frontend Security               | V3-REQ-01      | Define browser/frontend security requirements for client-side attack reduction.  | L1    | Not Started    | Frontend hardening controls deferred to Phase 2.                   | |
| V4         | API and Web Service                 | V4-REQ-01      | Define API authorization and access checks for privileged operations.            | L1    | In Progress    | ST-01 and ST-02 test these controls.                               | |
| V4         | API and Web Service                 | V4-REQ-02      | Define secure API response behavior to reduce unnecessary data exposure.         | L1    | In Progress    | Addressed through SR-06 and ST-06.                                 | |
| V5         | File Handling                       | V5-REQ-01      | Define file type and upload size restrictions.                                   | L1    | In Progress    | Linked to malicious upload and resource exhaustion threats.        | |
| V5         | File Handling                       | V5-REQ-02      | Define secure file retrieval and document access authorization rules.            | L1    | In Progress    | Mapped to predictable URL disclosure scenario.                     | |
| V6         | Authentication                      | V6-REQ-01      | Define authentication requirements for sensitive endpoints.                      | L1    | In Progress    | SR-01 documented and linked to spoofing threats.                   | |
| V6         | Authentication                      | V6-REQ-02      | Define credential and identity assurance baseline for privileged users.          | L1    | In Progress    | Included in mitigation strategy (strong auth and MFA intent).      | |
| V7         | Session Management                  | V7-REQ-01      | Define session timeout and invalidation requirements.                            | L1    | Not Started    | Planned for sprint implementation and verification.                | |
| V8         | Authorization                       | V8-REQ-01      | Define role-based authorization model for all protected operations.              | L1    | In Progress    | SR-02 mapped to elevation-of-privilege scenario.                   | |
| V8         | Authorization                       | V8-REQ-02      | Define least-privilege rules and privileged action constraints.                  | L1    | In Progress    | Included in design requirements and test scenarios.                | |
| V9         | Self-contained Tokens               | V9-REQ-01      | Define token claim validation and token misuse protections.                      | L1    | In Progress    | Token misuse covered in ST-01 design.                              | |
| V10        | OAuth and OIDC                      | V10-REQ-01     | Define OAuth/OIDC controls when delegated identity is used.                      | L1    | Not Applicable | No OAuth/OIDC integration in current project scope.                | |
| V11        | Cryptography                        | V11-REQ-01     | Define data-at-rest protection requirements for sensitive data.                  | L1    | In Progress    | Encryption at rest captured in mitigation strategy.                | |
| V12        | Secure Communication                | V12-REQ-01     | Define data-in-transit protection requirements.                                  | L1    | In Progress    | HTTPS/TLS requirement documented in mitigations and requirements.  | |
| V13        | Configuration                       | V13-REQ-01     | Define secure configuration baseline and validation process.                     | L1    | Not Started    | Planned as part of sprint hardening and testing.                   | |
| V13        | Configuration                       | V13-REQ-02     | Define dependency and configuration hygiene controls for third-party components. | L1    | In Progress    | Dependency vulnerability management requirement documented.        | |
| V14        | Data Protection                     | V14-REQ-01     | Define controls to prevent unauthorized data disclosure.                         | L1    | In Progress    | Mapped to information disclosure threats and tests ST-05/ST-06.    | |
| V14        | Data Protection                     | V14-REQ-02     | Define data minimization and confidentiality expectations.                       | L1    | In Progress    | Included as SR-06 and tied to GDPR context.                        | |
| V15        | Secure Coding and Architecture      | V15-REQ-01     | Define threat-driven architecture and secure design practices.                   | L1    | Compliant      | Analysis, DFDs, threats, risk, and mitigations are documented.     | |
| V15        | Secure Coding and Architecture      | V15-REQ-02     | Define architecture review checkpoints when trust boundaries change.             | L1    | In Progress    | Covered by threat-model review process in security testing plan.   | |
| V16        | Security Logging and Error Handling | V16-REQ-01     | Define audit logging requirements for sensitive actions and decisions.           | L1    | In Progress    | SR-07 mapped to ST-07 and repudiation threat.                      | |
| V16        | Security Logging and Error Handling | V16-REQ-02     | Define secure error-handling behavior to avoid sensitive leakage.                | L1    | Not Started    | Error-handling hardening planned for implementation phase.         | |
| V17        | WebRTC                              | V17-REQ-01     | Define WebRTC-specific security controls where real-time communication exists.   | L1    | Not Applicable | No WebRTC component in system design scope.                        | |

## 3. Notes

- Requirement IDs use a project checklist format (for example, V6-REQ-01) to keep tracking simple in Phase 1.
- End-to-end traceability is maintained in [Traceability Matrix](Documentation/TraceabilityMatrix.md).
