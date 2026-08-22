# Security Testing Rules

## Purpose
Prevent test activities from overlooking or introducing material security risk.
## Scope
Authentication, authorization, input handling, sessions, secrets, sensitive data, and abuse cases.
## MUST
- Verify critical authorization boundaries with positive and negative cases.
- Test security-sensitive input handling and session behavior appropriate to the system risk.
- Escalate suspected vulnerabilities through approved confidential channels.
## MUST NOT
- Expose secrets, tokens, personal data, or exploit details in unrestricted test artifacts.
- Weaken security controls merely to make tests pass.
- Perform intrusive production security testing without explicit authorization.
## SHOULD
- Align testing with threat models and recognized vulnerability classes.
## Exceptions
Any risky security test requires scope, safeguards, owner, rollback, and approval.
## Verification
Review security cases, access evidence, scanner results where applicable, and remediation validation.