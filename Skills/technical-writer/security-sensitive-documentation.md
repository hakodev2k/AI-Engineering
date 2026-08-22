# Security-sensitive Documentation

## Purpose
Document security-relevant setup and operations without encouraging unsafe defaults, secret exposure, or privilege misuse.
## When to use
Use for authentication, authorization, credentials, networking, encryption, admin operations, and incident procedures.
## Inputs
Approved security design, threat guidance, supported configuration, least-privilege model.
## Context to inspect
Secret stores, roles/scopes, network boundaries, logs, examples, defaults, rotation/recovery procedures.
## Core knowledge
Documentation shapes security posture. Examples must model least privilege, secret hygiene, safe failure, and environment separation.
## Procedure
1. Validate guidance with authoritative security sources/owners.
2. State threat-relevant assumptions and prerequisites.
3. Use placeholders and secret stores, never real credentials.
4. Specify minimum permissions and why they are needed.
5. Prefer secure defaults and mark insecure exceptions prominently.
6. Document rotation, revocation, audit, and recovery where relevant.
7. Avoid exposing sensitive diagnostic data in examples.
8. Test procedures with least-privileged accounts.
9. Define escalation for suspected compromise.
## Decision points
Show simplified local-development paths only when clearly isolated from production guidance.
## Common failure patterns
Admin tokens for convenience, secrets in URLs/code, disabling TLS verification, wildcard permissions, and copyable unsafe debug settings.
## Verification
Security owner reviews critical guidance and examples succeed with documented minimum privilege.
## Expected output
Actionable documentation that reinforces secure operation.
## Stop conditions
Do not publish unapproved workarounds that weaken security controls.