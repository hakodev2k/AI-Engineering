# Security Documentation Rules
## Purpose
Ensure documentation helps users operate securely without disclosing harmful sensitive information.
## Scope
Authentication, authorization, secrets, permissions, hardening, threat-related guidance, and security warnings.
## MUST
- Document security prerequisites, trust boundaries, least-privilege permissions, secret handling, and relevant secure defaults.
- Clearly identify actions that weaken protection or increase exposure.
- Coordinate sensitive vulnerability or exploit details with the responsible security process before publication.
- Use fictitious credentials and sanitized data in all examples.
## MUST NOT
- Publish active secrets, private keys, exploitable internal details, or instructions that bypass required controls without approved security context.
- Recommend disabling certificate, authentication, authorization, or validation controls as a routine fix.
## SHOULD
- Link security-sensitive guidance to authoritative policy or platform references.
## Exceptions
Controlled security research content requires explicit approval, audience boundaries, and disclosure review.
## Verification
Security review, secret scanning, permission review, threat-context review, and validation of secure defaults.