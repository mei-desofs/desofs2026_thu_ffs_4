# ASVS Checklist - Phase 1 (ASVS 5.0, 17 Chapters)

This checklist follows the ASVS 5.0 chapter model presented in T4 (17 chapters). It is Phase 1 focused, so many controls are design and planning oriented.

Status values (as used in class):

- Not Started
- In Progress
- Compliant
- Not Applicable

## V1 - Encoding and Sanitization

| ASVS Area                                               | Status      | Evidence                                                                  |
| ------------------------------------------------------- | ----------- | ------------------------------------------------------------------------- |
| Input/output encoding and sanitization rules identified | In Progress | Threat analysis and Security Testing plan (tampering/injection scenarios) |

## V2 - Validation and Business Logic

| ASVS Area                                                     | Status      | Evidence                                                |
| ------------------------------------------------------------- | ----------- | ------------------------------------------------------- |
| Input validation and business logic abuse protections defined | In Progress | Threat analysis misuse cases and Security Testing ST-03 |

## V3 - Web Frontend Security

| ASVS Area                                      | Status      | Evidence                       |
| ---------------------------------------------- | ----------- | ------------------------------ |
| Frontend security controls for browser context | Not Started | Planned for Phase 2 validation |

## V4 - API and Web Service

| ASVS Area                                              | Status      | Evidence                             |
| ------------------------------------------------------ | ----------- | ------------------------------------ |
| API abuse and authorization checks strategy documented | In Progress | Security Testing ST-01, ST-02, ST-06 |

## V5 - File Handling

| ASVS Area                                                    | Status      | Evidence                                          |
| ------------------------------------------------------------ | ----------- | ------------------------------------------------- |
| File upload and file access security requirements identified | In Progress | Threat analysis, misuse case, ST-04, ST-05, ST-08 |

## V6 - Authentication

| ASVS Area                                                 | Status      | Evidence                              |
| --------------------------------------------------------- | ----------- | ------------------------------------- |
| Authentication requirements defined for sensitive actions | In Progress | Security requirements SR-01 and ST-01 |

## V7 - Session Management

| ASVS Area                                  | Status      | Evidence                       |
| ------------------------------------------ | ----------- | ------------------------------ |
| Session lifecycle and timeout requirements | Not Started | Planned for Sprint 1 hardening |

## V8 - Authorization

| ASVS Area                                                          | Status      | Evidence                              |
| ------------------------------------------------------------------ | ----------- | ------------------------------------- |
| Role-based access rules and least privilege constraints documented | In Progress | Security requirements SR-02 and ST-02 |

## V9 - Self-contained Tokens

| ASVS Area                                            | Status      | Evidence                    |
| ---------------------------------------------------- | ----------- | --------------------------- |
| Token claims, validation and misuse risks documented | In Progress | ST-01 token misuse scenario |

## V10 - OAuth and OIDC

| ASVS Area                           | Status         | Evidence                                                |
| ----------------------------------- | -------------- | ------------------------------------------------------- |
| OAuth/OIDC integration requirements | Not Applicable | Current project scope does not include OAuth/OIDC login |

## V11 - Cryptography

| ASVS Area                                         | Status      | Evidence                               |
| ------------------------------------------------- | ----------- | -------------------------------------- |
| Data-at-rest cryptography requirements identified | In Progress | Mitigations mention encryption at rest |

## V12 - Secure Communication

| ASVS Area                                          | Status      | Evidence                      |
| -------------------------------------------------- | ----------- | ----------------------------- |
| Data-in-transit protection requirements identified | In Progress | Mitigations mention HTTPS/TLS |

## V13 - Configuration

| ASVS Area                                             | Status      | Evidence                          |
| ----------------------------------------------------- | ----------- | --------------------------------- |
| Secure configuration baseline and validation planning | Not Started | Planned for Sprint 1 and Sprint 2 |

## V14 - Data Protection

| ASVS Area                                                         | Status      | Evidence                        |
| ----------------------------------------------------------------- | ----------- | ------------------------------- |
| Data classification and disclosure prevention controls identified | In Progress | Threat analysis and ST-05/ST-06 |

## V15 - Secure Coding and Architecture

| ASVS Area                                                               | Status    | Evidence                                                 |
| ----------------------------------------------------------------------- | --------- | -------------------------------------------------------- |
| Secure architecture and threat-model driven design practices documented | Compliant | Dataflows, threat analysis, risk assessment, mitigations |

## V16 - Security Logging and Error Handling

| ASVS Area                                                            | Status      | Evidence                             |
| -------------------------------------------------------------------- | ----------- | ------------------------------------ |
| Logging, traceability and secure error handling requirements defined | In Progress | SR-07, ST-07 and mitigation controls |

## V17 - WebRTC

| ASVS Area                             | Status         | Evidence                                  |
| ------------------------------------- | -------------- | ----------------------------------------- |
| WebRTC-specific security requirements | Not Applicable | Project does not use WebRTC communication |

## Gap Summary and Next Steps

1. Move all In Progress controls to Compliant with implementation evidence in Sprint 1.
2. Add requirement-by-requirement references (documentation links, code links, test results).
3. Automate SAST/SCA and attach reports as ASVS evidence.
4. Document session lifecycle and token hardening details for V7 and V9.
5. Keep one checklist sheet per chapter if you want to mirror the lecture format exactly.
