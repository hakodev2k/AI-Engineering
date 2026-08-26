# Permissions and User Consent Rules
## Purpose
Ensure powerful capabilities are granted intentionally, minimally, and revocably.
## Scope
Permission prompts, user activation, persisted grants, device access, and policy-controlled capabilities.
## MUST
- Capability checks MUST occur at the privileged enforcement point before access.
- Permission state MUST be scoped to the correct principal and lifecycle.
- User-facing consent MUST accurately describe the capability being granted.
## MUST NOT
- MUST NOT treat UI presentation alone as authorization.
- MUST NOT persist broader authority than the user or policy granted.
## SHOULD
- SHOULD prefer one-time, scoped, and revocable grants where compatible with requirements.
## Exceptions
Broader or implicit grants require security/privacy approval and documented platform rationale.
## Verification
Use permission-state tests, revocation tests, origin-transition tests, UI-to-enforcement integration tests, and policy inspection.