# Database Security Rules
## Purpose
Reduce unauthorized access, injection exposure, and privilege escalation.
## Scope
Database identities, roles, network access, secure configuration, and auditing.
## MUST
- Grant least privilege to human and workload identities and separate administrative access from application access.
- Require parameterized database access or equivalent safe binding for untrusted input.
- Audit privileged and security-sensitive operations where supported.
## MUST NOT
- Embed database credentials in source code or shared scripts.
- Disable authentication, encryption, or audit controls merely to unblock delivery.
## SHOULD
- Use short-lived or managed identities where platform support permits.
## Exceptions
Security exceptions require threat/risk analysis, compensating controls, owner, expiry, and approval.
## Verification
Inspect grants, identities, network rules, audit configuration, code paths, secret scans, and access reviews.