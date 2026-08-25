# Security Rules
## Purpose
Establish secure defaults for Python systems.
## Scope
Code, dependencies, serialization, execution, and integrations.
## MUST
- Authorization MUST be enforced server-side at protected operations.
- User-controlled input reaching interpreters, shells, queries, or templates MUST use safe parameterization or constrained APIs.
- Security-sensitive changes MUST have explicit validation evidence.
## MUST NOT
- MUST NOT use unsafe deserialization for untrusted data.
- MUST NOT disable certificate verification or security controls merely to unblock execution.
- MUST NOT execute untrusted code without an approved isolation model.
## SHOULD
- Apply least privilege and minimize attack surface.
## Exceptions
Security exceptions require risk documentation and human approval.
## Verification
Security tests, scanners, configuration review, and threat-focused code review.