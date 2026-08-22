# Security Testing Rules
## Purpose
Ensure quality verification includes realistic security boundaries and does not weaken controls.
## Scope
Authentication, authorization, input handling, sessions, secrets, sensitive data, and abuse cases.
## MUST
- Verify access control using positive and negative identity/role scenarios for protected behavior.
- Test relevant input trust boundaries and sensitive-data exposure.
- Escalate credible vulnerabilities through the approved security process with reproducible evidence.
## MUST NOT
- Disable security controls to obtain a passing result.
- Place secrets, tokens, or sensitive payloads in test artifacts or logs without approved protection.
- Perform intrusive production security testing without authorization.
## SHOULD
- Align coverage with applicable threat models and recognized vulnerability classes.
## Exceptions
Security-control bypasses are permitted only in isolated test fixtures explicitly designed for that purpose.
## Verification
Review authorization matrices, security cases, scanner evidence, logs, and vulnerability disposition.